# how to test LED animate

### Step 1

#### png 轉 json

用~NTUEE_light_dance/test/LED
放在同個資料夾
！！注意！！
連續 led 圖片 json 的檔名要照播放順序（資料夾內的順序）

### Step 2

#### 把 json 們傳到 r-pi 上

把檔案們放在一個資料夾
再放到 ~/NTUEE_light_dance/client/image_test/json/

### Step 3

#### 調整路徑

有兩個方法：

1.

在~/NTUEE_light_dance/client/image_test/testImg.cpp
其中有個路徑 Dir
改成 Step 2 那個資料夾的路徑
改完記得 make

2.
直接跳到 Step 4 把路徑輸到 Dir_path

\*如果要改每張圖的間隔 就改 TEST_INTERVAL (ms)

### Step 4

#### 執行 testImg

> > sudo ./testImg <LED_id> [Dir_path]

LED_id：
0 -> 300 顆
1,2 -> 35 顆
