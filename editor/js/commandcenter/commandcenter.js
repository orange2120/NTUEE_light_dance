import tableDragger from 'table-dragger'

const axios = require('axios').default;

class Commandcenter{
    constructor(mgr){
        this.mgr = mgr
        this.container = document.getElementById("conrtol_zone")
        this.status_zone = document.getElementById("status_zone")
        // let el = document.getElementById('items');
        this.renderPannel()
        
        // this.boards = [1,2,3]
        this.reloadBoardsStatus()
        // document.getElementById("btn_test").onclick= function(){
        //     async function getUser() {
        //         try {
        //           const response = await axios.get('/test?ID=12345');
        //           console.log(response);
        //         } catch (error) {
        //           console.error(error);
        //         }
        //     }
        //     getUser()
        // }
    }
    
    async reloadBoardsStatus(){
        clearInterval(this.setReloadInterval);
        console.log("called")
        try {
            const response = await axios.get('/api/getCurrentInfo');
            console.log(response.data);
            console.log(this.status_zone);
            console.log(this.boards)
            if((this.boards,response.data.boards)){
                let t = document.createElement("table")
                t.id="board_table"
                let h = t.createTHead();
                let row = h.insertRow(0);
                let table_header=['ID','IP','MAC','Status','Select']
                for (const y of table_header){
                    let cell = row.insertCell();
                    cell.innerHTML = y;
                    cell.className="handle"
                }
                
                // document.getElementById('board_table_body')
                response.data.boards.forEach((b)=>{
                    // console.log(b)
                    let r = t.insertRow()
                    let c = r.insertCell()
                    c.innerHTML = b.id 
                    c = r.insertCell()
                    c.innerHTML = b.ip
                    c = r.insertCell()
                    c.innerHTML = b.mac
                    c = r.insertCell()
                    c.innerHTML = b.status
                    c = r.insertCell()
                })
                this.status_zone.innerHTML=""
                this.status_zone.appendChild(t)
                this.boards = response.data
                // tableDragger(document.getElementById('board_table'), { mode: "row", onlyBody: true });
            
            
            }
            if((this.boards,response.data.waitingList)){
                let t = document.createElement("table")
                t.id="waitingList_table"
                let h = t.createTHead();
                let row = h.insertRow(0);
                let table_header=['IP','MAC','Select']
                for (const y of table_header){
                    let cell = row.insertCell();
                    cell.innerHTML = y;
                    cell.className="handle"
                }
                
                // document.getElementById('board_table_body')
                response.data.waitingList.forEach((b)=>{
                    // console.log(b)
                    let r = t.insertRow()
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
                    c.appendChild(btn_add_config)
                })
                // this.status_zone.innerHTML=""
                this.status_zone.appendChild(t)
                this.boards = response.data
                // tableDragger(document.getElementById('board_table'), { mode: "row", onlyBody: true });
            
            
            }
          } catch (error) {
            console.error(error);
        }
        this.setReloadInterval = setInterval(this.reloadBoardsStatus, 3000);
    }
    renderPannel(){
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
        
        this.container.appendChild(btn_save_config)
        this.container.appendChild(btn_reload_config)
        this.container.appendChild(btn_clear_config)
        
    }
    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
      
        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
    }
}

export default Commandcenter