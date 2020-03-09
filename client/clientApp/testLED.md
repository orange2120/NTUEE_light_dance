# how to test LED animate

### Step 1
#### png轉json
用~NTUEE_light_dance/test/LED

### Step 2
#### 把json們傳到r-pi上
把檔案們放在 ~/NTUEE_light_dance/client/clientApp/json/

### Step 3
#### 去改./clientApp的讀檔路徑
在~/NTUEE_light_dance/client/clientApp/inc/definition.h
其中有個讀檔路徑FILENAME
如果要測試100ms一張的動畫建議用test2.json(我已經大概調好時間間隔了)

### Step 4
#### 去改json(for example test2.json)
json裡面會有每個dancer的資料，只要去改第一位就好
每次改變EL或LED會有一個execution
每個execution裡面會有start(StartTime)
該execution會持續到下一個execution的start
舉例來說如果要100ms跳一張 就把start改成0 100 200 300 400...
如果要測300顆的 就去改LED_CHEST.name 
       40顆的 就改LED_R_SHOE.name
！！記得name不要加.json
要測n張，就改n+1個(因為最後一個execution不會執行，會被視為結束的時間點)
阿最後那張的name直接改成 "" 就好
對...就一張一張改QQ

### Step 5
#### 執行clientApp
>> sudo ./clientApp [dancer_id]
>> run [time]

dancer_id default 是0(所以前面才說只要改第一位舞者)
time default 是0
全部run完可以再run
