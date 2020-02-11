OS=`uname`
IO="" # store IP
echo "$OS"
case $OS in
   Linuxs) IP=`ifconfig  | grep 'inet addr:'| grep -v '127.0.0.1' | cut -d: -f2 | awk '{ print $1}'`;;
   FreeBSD|OpenBSD|Darwin|Linux) IP=`ifconfig  | grep -E 'inet.[0-9]' | grep -v '127.0.0.1' | awk '{ print $2}'` ;;
   SunOS) IP=`ifconfig -a | grep inet | grep -v '127.0.0.1' | awk '{ print $2} '` ;;
   *) IP="Unknown";;
esac
echo "$IP"
A="$(cut -d'.' -f1-3 <<<"$IP")"

for ipp in $A.{1..254}; do ping -c1 ${ipp} & done

# exit 0
# echo "$A"