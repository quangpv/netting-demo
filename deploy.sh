rm netting-demo.zip &>/dev/null

zip -r netting-demo.zip config public scripts src package.json tsconfig.json yarn.lock

scp netting-demo.zip $pi:~/

ssh $pi "unzip netting-demo.zip -d netting-demo && rm netting-demo.zip"
ssh $pi "cd netting-demo && yarn start"
rm netting-demo.zip