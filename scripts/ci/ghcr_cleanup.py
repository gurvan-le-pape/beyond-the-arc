"""Deletes old image versions from GHCR; only reports them unless DELETE=true.

Every image is an index pointing at untagged manifests, so "untagged" does not
mean unused: the manifests of a kept index are read from the registry and kept.
Nothing is deleted from a package until all of its kept indexes have been read.

Kept: every tag that is not a commit SHA (`latest`), the newest KEEP commits of
origin/main that have an image, whatever a kept index points at, and anything
updated in the last MIN_AGE_DAYS, which covers a push in progress.

Run from a full clone, with GITHUB_TOKEN and GITHUB_REPOSITORY set.
"""

import base64
import json
import os
import re
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

PACKAGES = ("backend", "backend-migrate", "scheduler", "frontend")
KEEP = 30
MIN_AGE_DAYS = 2
# Per package and run: GITHUB_TOKEN is limited to 1000 requests an hour.
MAX_DELETIONS = 150
SHA = re.compile(r"[0-9a-f]{40}")
INDEX_TYPES = (
    "application/vnd.oci.image.index.v1+json, "
    "application/vnd.docker.distribution.manifest.list.v2+json, "
    "application/vnd.oci.image.manifest.v1+json, "
    "application/vnd.docker.distribution.manifest.v2+json"
)


def request(url, headers, method="GET"):
    req = urllib.request.Request(url, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as response:
        body = response.read()
    return json.loads(body) if body else None


def select(versions, commits, children_of, now):
    """Returns the versions to delete, oldest first.

    `commits` is origin/main, newest first; `children_of` maps a digest to the
    digests its manifest points at, and raises when it cannot be read.
    """
    tagged = {tag for v in versions for tag in v["tags"]}
    if "latest" not in tagged:
        raise RuntimeError("no `latest` tag: refusing to select anything")
    keep_tags = set([c for c in commits if c in tagged][:KEEP])
    if not keep_tags:
        raise RuntimeError("no image belongs to a commit of main")
    cutoff = now - timedelta(days=MIN_AGE_DAYS)
    kept = {
        v["digest"]
        for v in versions
        if v["updated"] > cutoff
        or any(t in keep_tags or not SHA.fullmatch(t) for t in v["tags"])
    }
    for digest in list(kept):
        kept.update(children_of(digest))
    return sorted(
        (v for v in versions if v["digest"] not in kept), key=lambda v: v["updated"]
    )


def clean(package, commits, owner, repo, token, delete):
    api = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    name = urllib.parse.quote(f"{repo}/{package}", safe="")
    base = f"https://api.github.com/users/{owner}/packages/container/{name}/versions"
    versions, page = [], 1
    while batch := request(f"{base}?per_page=100&page={page}", api):
        versions += [
            {
                "id": v["id"],
                "digest": v["name"],
                "tags": v["metadata"]["container"]["tags"],
                "updated": datetime.fromisoformat(v["updated_at"].replace("Z", "+00:00")),
            }
            for v in batch
        ]
        page += 1

    basic = base64.b64encode(f"{owner}:{token}".encode()).decode()
    scope = f"repository:{owner}/{repo}/{package}:pull"
    pull = request(
        f"https://ghcr.io/token?service=ghcr.io&scope={scope}",
        {"Authorization": f"Basic {basic}"},
    )["token"]

    def children_of(digest):
        manifest = request(
            f"https://ghcr.io/v2/{owner}/{repo}/{package}/manifests/{digest}",
            {"Authorization": f"Bearer {pull}", "Accept": INDEX_TYPES},
        )
        return {m["digest"] for m in manifest.get("manifests", [])}

    doomed = select(versions, commits, children_of, datetime.now(timezone.utc))
    tagged = sum(bool(v["tags"]) for v in doomed)
    print(f"{package}: {len(versions)} versions, {len(doomed)} to delete ({tagged} tagged)")
    for v in doomed[:3] + doomed[-3:]:
        print(f"  {v['updated']:%Y-%m-%d} {v['digest'][:19]} {','.join(v['tags'])[:12]}")
    if not delete:
        return
    for v in doomed[:MAX_DELETIONS]:
        try:
            request(f"{base}/{v['id']}", api, "DELETE")
        except urllib.error.HTTPError as error:
            # 404: already gone. Anything else fails the job.
            if error.code != 404:
                raise
        time.sleep(1)  # GitHub's spacing for requests that write
    print(f"  deleted {min(len(doomed), MAX_DELETIONS)}")


def main():
    owner, repo = os.environ["GITHUB_REPOSITORY"].lower().split("/")
    commits = subprocess.check_output(
        ["git", "rev-list", "origin/main"], text=True
    ).split()
    delete = os.environ.get("DELETE") == "true"
    print("Deleting" if delete else "Dry run: nothing is deleted")
    for package in PACKAGES:
        clean(package, commits, owner, repo, os.environ["GITHUB_TOKEN"], delete)


if __name__ == "__main__":
    main()
