#!/usr/bin/env bash
#
# Test-Netwrok#2 -- give the Fabric 2.2 peer a modern Node runtime.
#
# The Fabric 2.2 Node chaincode runtime image, hyperledger/fabric-nodeenv:2.2,
# ships Node v12.16.1. Node 12 cannot parse modern JavaScript syntax (e.g. the
# logical-assignment operator ||=) that current chaincode dependencies emit, so
# the chaincode container exits with "SyntaxError: Unexpected token '='" during
# registration and the deploy hangs. Fabric 2.2 is end-of-life and will not be
# upgraded upstream.
#
# The fix is to retag a newer nodeenv (2.5 ships Node 22) under the ":2.2" tag
# the 2.2 peer looks for when it builds a node chaincode. This script does that,
# idempotently: it is a no-op if fabric-nodeenv:2.2 already runs Node 18+.
#
# Run it once per host before `./network.sh deployCC ... -ccl javascript`.

set -euo pipefail

NODEENV_TAG="hyperledger/fabric-nodeenv:2.2"
MODERN_TAG="${MODERN_NODEENV_TAG:-hyperledger/fabric-nodeenv:2.5}"

node_major() {
  # Print the major Node version of an image, or 0 if the image is absent/unusable.
  docker run --rm --entrypoint node "$1" \
    -e 'process.stdout.write(process.versions.node.split(".")[0])' 2>/dev/null || echo 0
}

current="$(node_major "$NODEENV_TAG")"
if [ "${current:-0}" -ge 18 ] 2>/dev/null; then
  echo "fabric-nodeenv:2.2 already runs Node ${current} -- nothing to do."
  exit 0
fi

echo "fabric-nodeenv:2.2 runs Node ${current:-<absent>}; retagging ${MODERN_TAG} (Node 22) as 2.2..."
docker pull "$MODERN_TAG"
docker tag "$MODERN_TAG" "$NODEENV_TAG"
echo "Done. The 2.2 peer will now build node chaincode with $(node_major "$NODEENV_TAG" | sed 's/^/Node /')."
