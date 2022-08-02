#!/bin/sh

HOST="${HOST:-https://localhost:3000}"

echo testing against $HOST

if [ "$HOST" = "https://localhost:3000" ]; then

    echo killing process on port
    kill $(lsof -t -i:3001) || true
    while [[ -n $(lsof -t -i:3001) ]]; do echo waiting kill; sleep 1; done; \
    
    echo killing ssl proxy
    kill $(pgrep local-ssl-proxy) || true
    
    PORT=3001 npm run dev &

    echo proxying ssl
    npx local-ssl-proxy --source 3000 --target 3001 &
fi

until $(curl --output /dev/null --head --fail -k $HOST); do

    sleep 5
    echo server is unreachable

done

if [ -z "$CI" ]; then
    
    echo detected non-ci environment
    PLAYWRIGHT_SLOW_MO="${PLAYWRIGHT_SLOW_MO:-400}"

fi

TEST_HOST=$HOST PLAYWRIGHT_SLOW_MO=$PLAYWRIGHT_SLOW_MO npx playwright@^1.24.2 test ./e2e-tests || { echo 'test failed' ; exit 1; }

if [ "$HOST" = "https://localhost:3000" ]; then

    echo killing process on port 3001
    kill $(lsof -t -i:3001) || true

    echo killing ssl proxy
    kill $(pgrep local-ssl-proxy) || true
fi