import tableDragger from 'table-dragger'

const axios = require('axios').default;

class Commandcenter{
    constructor(mgr){
        this.mgr = mgr
        this.container = document.getElementById("conrtol_zone")
        this.status_zone = document.getElementById("status_zone")
        // let el = document.getElementById('items');
        
        
        this.boards = [1,2,3]
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
            const response = await axios.get('/api/getBoardsInfo');
            console.log(response.data);
            console.log(this.status_zone);
            console.log(this.boards)
            if((this.boards,response.data)){
                let t = document.createElement("table")
                t.id="board_table"
                let h = t.createTHead();
                let row = h.insertRow(0);
                let table_header=['ID','IP','MAC','Status','Select']
                for (const y of table_header){
                    let cell = row.insertCell(0);
                    cell.innerHTML = y;
                    cell.className="handle"
                }
                
                // document.getElementById('board_table_body')
                response.data.forEach((b)=>{
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
                tableDragger(document.getElementById('board_table'), { mode: "row", onlyBody: true });
            }
            
          } catch (error) {
            console.error(error);
        }
        this.setReloadInterval = setInterval(this.reloadBoardsStatus, 3000);
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