#zip all files to nw archive
zip -r Schreiberling.nw ./*
#copy nw.pak from current build node-webkit
cp /opt/node-webkit/nw.pak ./nw.pak
cp /opt/node-webkit/icudtl.dat ./icudtl.dat
#compilation to executable form
cat /opt/node-webkit/nw ./Schreiberling.nw > ../build/linux/Schreiberling && chmod +x ../build/linux/Schreiberling
#move nw.pak to build folder
mv ./nw.pak ../build/linux/nw.pak
mv ./icudtl.dat ../build/linux/icudtl.dat
#remove Schreiberling.nw
rm ./Schreiberling.nw
#run application
../build/linux/Schreiberling