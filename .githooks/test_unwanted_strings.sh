#/bin/sh

found=$(grep -R --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.githooks --exclude-dir=.git 'console.log')
count=$(echo "$found" | grep -e '^[^#]' | wc -l)
echo console.log found: "$found"
echo count: "$count"

if [ $count -ne 1 ]; then
    echo remove "$count" console.log "statement(s)"
    echo $(echo "$found" | tail --lines=+1)
    exit 1
fi

found=$(grep -R --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.githooks --exclude-dir=.git 'page.pause')
count=$(echo "$found" | grep -e '^[^#]' | wc -l)
echo page.pause found: "$found"
echo count: "$count"

if [ $count -ne 0 ]; then
    echo remove "$count" page.pause "statement(s)"
    echo $(echo "$found" | tail --lines=+1)
    exit 1
fi
