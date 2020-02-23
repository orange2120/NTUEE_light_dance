import tableDragger from 'table-dragger'

const axios = require('axios').default;

class Commandcenter{
    constructor(mgr){
        this.mgr = mgr
        this.visible = true
        this.allowScanNewBoard = true
    }
    hide(){
        this.visible = false
        this.disableScanBoard()
    }
    show(){
        this.visible = true
        this.smartRenderLayout()
        this.enableScanBoard()
        
        
    }
    enableScanBoard(){
        if(this.allowScanNewBoard === false)
        {
            this.allowScanNewBoard = true
            this.setReloadInterval = setInterval(this.reloadBoardsStatus, 3000);
            if(document.getElementById("config_zone") != undefined){
                document.getElementById("config_zone").hidden = false
            }
            
            
        }
        
    }
    disableScanBoard(){
        if(this.allowScanNewBoard === true){
            this.allowScanNewBoard = false
            clearInterval(this.setReloadInterval);
            if(document.getElementById("config_zone") != undefined){
                document.getElementById("config_zone").hidden = true
            }
        }
        
    }
    init(){
        this.show()
        // this.container = document.getElementById("conrtol_zone")
        // this.status_zone = document.getElementById("status_zone")

        // this.test()
        // this.renderPannel()
        // this.reloadBoardsStatus()
    }
    async reloadBoardsStatus(){
        // console.log(this)
        
        console.log("called")
        try {
            const response = await axios.get('/api/getCurrentInfo');
            let el = document.getElementById("commandComponent_zone")
            if((this.boards,response.data.boards)){
                if(this.boards != undefined && el.title!="init"  && JSON.stringify(response.data.boards) === JSON.stringify(this.boards) ){
                    
                }else{
                    el.title = ""
                    
                    let t = document.getElementById("board_table")
                    
                    // t.getElementsByTagName("tbody")[0].innerHTML=""
                    let tb = t.getElementsByTagName("tbody")[0]
                    tb.innerHTML=""
                    // if(tb!=undefined){
                    //     tb.innerHTML=""
                    // }
                    
                    
                    // document.getElementById('board_table_body')
                    response.data.boards.forEach((b)=>{
                        // console.log(b)
                        let r = tb.insertRow()
                        let c = r.insertCell()
                        c.innerHTML = b.id 
                        c = r.insertCell()
                        c.innerHTML = b.ip
                        c = r.insertCell()
                        c.innerHTML = b.mac
                        c = r.insertCell()
                        c.className="class_" + b.status
                        c.innerHTML = b.status
                        c = r.insertCell()
                        let cbx = document.createElement("input")
                        cbx.type = "checkbox"
                        cbx.id="cbx"
                        if(b.status==="disconnect"){
                            cbx.disabled="disabled"
                        }
                        c.appendChild(cbx)
                    })
                    
                    this.boards = response.data.boards
                    
                    }
            
            }
            
            if((response.data.waitingList)){
                if(this.waitingList != undefined && el.title!="init" && JSON.stringify(response.data.waitingList) === JSON.stringify(this.boardwaitingLists)){
                    
                }else{
                    el.title = ""
                        let t = document.getElementById("waitlist_zone_table")
                        let tb = t.getElementsByTagName("tbody")[0]
                        tb.innerHTML=""
                        // if(tb!=undefined){
                        //     tb.innerHTML=""
                        // }else{
                        //     tb=document.createElement("tbody")
                        //     t.appendChild(tb)
                        // }
                        // tb = t.getElementsByTagName("tbody")[0]
                        // console.log("asd")
                        response.data.waitingList.forEach((b)=>{
                            // console.log(b)
                            let r = tb.insertRow()
                            let c = r.insertCell()
                            c.innerHTML = b.ip
                            c = r.insertCell()
                            c.innerHTML = b.mac
                            c = r.insertCell()
                            let btn_add_config = document.createElement("button")
                            btn_add_config.innerText="add Board"
                            btn_add_config.onclick = function(){
                                // alert(b.mac)
                                axios.get('/api/config/addBoard' , { params: { mac: b.mac } });
                            }
                            let btn_alert = document.createElement("button")
                            btn_alert.innerText="alert Board"
                            btn_alert.onclick = function(){
                                // alert(b.mac)
                                axios.get('/api/config/alert' , { params: { mac: b.mac } });
                            }
                            c.appendChild(btn_add_config)
                            c.appendChild(btn_alert)
                        })
                    
                        // this.boards = response.data
                        
                    
                    
                    }
            }
        } catch (error) {
            console.error(error);
        }
        
        
                
                   
        
    }
    smartRenderLayout(){
        clearInterval(this.smartRenderInterval)
        
        if(this.renderLayout()){
            
        }else{
            if(this.visible){
                this.smartRenderInterval = setInterval(this.smartRenderLayout, 3000);
            }
        }

    }
    renderLayout(){
        // let el = document.getElementById("btnConfig_zone");
        let el = document.getElementById("commandComponent_zone");
        el.title = "init"
        
        if(el==null){
            return false
        }

        //  status zone
        {
            let status_zone = document.createElement("div")
            let status_zone_title = document.createElement("h6")
            status_zone.id="status_zone"
            status_zone_title.innerText="Boards in Config"
            status_zone.appendChild(status_zone_title)

            let board_table = document.createElement("table")
            board_table.id="board_table"
            let board_table_h = board_table.createTHead();
            board_table.createTBody();
            let board_table_h_row = board_table_h.insertRow(0);
            let table_header=['ID','IP','MAC','Status','Select']
            for (const y of table_header){
                let cell = board_table_h_row.insertCell();
                cell.innerHTML = y;
                if(y==="Select"){
                    let cbx = document.createElement("input")
                    cbx.type = "checkbox"
                    cbx.onchange=function(){
                        let tbody =document.getElementById("board_table").tBodies[0]
                        
                        for (let j = 0; j < tbody.rows.length; j++) {
                            let row = tbody.rows[j];
                            if(row.cells[4].firstChild.disabled){
                                row.cells[4].firstChild.checked=false
                            }else{
                                row.cells[4].firstChild.checked=this.checked
                            }
                            
                        }
                    }
                    cell.appendChild(cbx)
                }
                cell.className="handle"
            }
            status_zone.appendChild(board_table)

            el.appendChild(status_zone)
        }

        //control zone
        {
            function getSelected(){
                let tbody =document.getElementById("board_table").tBodies[0]
                let id_arr = []
                for (let j = 0; j < tbody.rows.length; j++) {
                    let row = tbody.rows[j];
                    if(row.cells[4].firstChild.checked){
                        id_arr.push(Number(row.cells[0].innerText))
                    }
                }
                return id_arr
            }
            let conrtol_zone = document.createElement("div")
            conrtol_zone.id="conrtol_zone"
            

            let allow_scan = document.createElement("input")
            allow_scan.type="checkbox"
            allow_scan.id="chbx_allow_scan"
            let self = this
            allow_scan.checked=false
            allow_scan.onchange= function(){
                if(this.checked===true){
                    self.enableScanBoard()
                }else{
                    self.disableScanBoard()
                }
                // self.allowScanNewBoard = this.
            }

            let allow_scan_title = document.createElement("label")
            allow_scan_title.innerText="Scan for new board"


            let btn_upload = document.createElement("button")
            btn_upload.innerText="Upload"
            btn_upload.id="btn_upload"
            btn_upload.onclick = function(){
                let id_arr = getSelected()
                if(id_arr.length!=0){
                    axios.get('/api/upload' , { params: { ids: id_arr ,time:0} });
                }
                console.log(id_arr)
            }

            let btn_reconnect = document.createElement("button")
            btn_reconnect.id="btn_reconnect"
            btn_reconnect.innerText="Reconnect"
            btn_reconnect.onclick = function(){
                let id_arr = getSelected()
                if(id_arr.length!=0){
                    axios.get('/api/reconnect' , { params: { ids: id_arr ,time :0} });
                }
                console.log(id_arr)
            }

            let btn_kick = document.createElement("button")
            btn_kick.id="btn_kick"
            btn_kick.innerText="Kick"
            btn_kick.onclick = function(){
                let id_arr = getSelected()
                if(id_arr.length!=0){
                    axios.get('/api/kick' , { params: { ids: id_arr ,time :0} });
                }
                console.log(id_arr)
            }

            let btn_reboot = document.createElement("button")
            btn_reboot.id="btn_reboot"
            btn_reboot.innerText="Reboot"
            btn_reboot.onclick = function(){
                let id_arr = getSelected()
                if(id_arr.length!=0){
                    axios.get('/api/reboot' , { params: { ids: id_arr ,time :0} });
                }
                console.log(id_arr)
            }

            let btn_play = document.createElement("button")
            btn_play.id="btn_play"
            btn_play.innerText="Play"
            btn_play.onclick = function(){
                let id_arr = getSelected()
                if(id_arr.length!=0){
                    axios.get('/api/play' , { params: { ids: id_arr ,time :0} });
                }
                console.log(id_arr)
            }

            let btn_pause = document.createElement("button")
            btn_pause.id="btn_pause"
            btn_pause.innerText="Pause"
            btn_pause.onclick = function(){
                let id_arr = getSelected()
                if(id_arr.length!=0){
                    axios.get('/api/pause' , { params: { ids: id_arr ,time :0} });
                }
                console.log(id_arr)
            }
            
            conrtol_zone.appendChild(allow_scan)
            conrtol_zone.appendChild(allow_scan_title)
            conrtol_zone.appendChild(btn_upload)
            conrtol_zone.appendChild(btn_reconnect)
            conrtol_zone.appendChild(btn_kick)
            conrtol_zone.appendChild(btn_reboot)
            conrtol_zone.appendChild(btn_play)
            conrtol_zone.appendChild(btn_pause)


            el.appendChild(conrtol_zone)
        }
        

        //config zone
        {
            let config_zone = document.createElement("div")
            config_zone.id="config_zone"
            
            let waitlist_zone = document.createElement("div")
            let waitlist_zone_title = document.createElement("h6")
            waitlist_zone_title.innerText="Boards Not Registered"
            
            let waitlist_zone_table = document.createElement("table")
            waitlist_zone_table.id = "waitlist_zone_table"

            
            {
                let h = waitlist_zone_table.createTHead();
                waitlist_zone_table.createTBody();
                let row = h.insertRow(0);
                let table_header=['IP','MAC','Select']
                for (const y of table_header){
                    let cell = row.insertCell();
                    cell.innerHTML = y;
                    cell.className="handle"
                }
            }
            
            
            waitlist_zone.appendChild(waitlist_zone_title)
        
            waitlist_zone.appendChild(waitlist_zone_table)
            
            config_zone.appendChild(waitlist_zone)
            
            let btnConfig_zone = document.createElement("div")
            btnConfig_zone.id = "btnConfig_zone"

            let btn_save_config = document.createElement("button")
            btn_save_config.innerText="Save"
            btn_save_config.onclick=function(){
                const response =  axios.get('/api/config/save');
            }

            let btn_reload_config = document.createElement("button")
            btn_reload_config.innerText="reload"
            btn_reload_config.onclick=function(){
                const response =  axios.get('/api/config/reload');
            }

            let btn_clear_config = document.createElement("button")
            btn_clear_config.innerText="clear"
            btn_clear_config.onclick=function(){
                const response =  axios.get('/api/config/clear');
            }
            
            btnConfig_zone.appendChild(btn_save_config)
            btnConfig_zone.appendChild(btn_reload_config)
            btnConfig_zone.appendChild(btn_clear_config)

            config_zone.appendChild(btnConfig_zone)

            el.appendChild(config_zone)
        }
        return true
    }


    
}

export default Commandcenter