#include <iostream>

using namespace ::std;

int main()
{
    cout<<"run"<<endl;
    string ss;
    while(cin>>ss)
    {
        if(ss=="run")
        {
            system("omxplayer ../../music/eenight.wav");
        }
    }

}