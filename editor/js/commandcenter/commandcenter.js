// import tableDragger from 'table-dragger'
const TIME_WAIT_TO_PLAY = 3000;
const axios = require("axios").default;
class Commandcenter {
  constructor(mgr) {
    this.mgr = mgr;
    this.visible = true;
    this.allowUpdateBoard = false;
    this.allowEditConfig = true;
  }
  hide() {
    this.visible = false;
    this.disableUpdateBoard();
  }
  show() {
    this.visible = true;
    this.smartRenderLayout();
    this.enableUpdateBoard();
    if (this.allowEditConfig) {
      this.enableEditConfig();
      document.getElementById("chbx_allow_scan").checked = true;
    } else {
      this.disableEditConfig();
      document.getElementById("chbx_allow_scan").checked = false;
    }
  }
  enableEditConfig() {
    // if(!this.allowEditConfig){
    this.allowEditConfig = true;
    if (document.getElementById("config_zone") != undefined) {
      document.getElementById("config_zone").style.visibility = "visible";
      document.getElementById("boards_control_zone").style.pointerEvents =
        "none";
      document.getElementById("boards_control_zone").style.opacity = "0.4";
    }
    // }
  }
  disableEditConfig() {
    // if(this.allowEditConfig){
    this.allowEditConfig = false;
    if (document.getElementById("config_zone") != undefined) {
      document.getElementById("config_zone").style.visibility = "hidden";
      document.getElementById("boards_control_zone").style.pointerEvents =
        "all";
      document.getElementById("boards_control_zone").style.opacity = "1";
    }
    // }
  }
  enableUpdateBoard() {
    if (this.allowUpdateBoard == false) {
      this.allowUpdateBoard = true;
      this.setReloadInterval = setInterval(this.reloadBoardsStatus, 3000);
    }
  }
  disableUpdateBoard() {
    if (this.allowUpdateBoard == true) {
      this.allowUpdateBoard = false;
      clearInterval(this.setReloadInterval);
    }
  }
  init() {
    this.show();
  }
  async reloadBoardsStatus() {
    // console.log(this)

    console.log("called");
    try {
      const response = await axios.get("/api/getCurrentInfo");
      let el = document.getElementById("commandComponent_zone");
      if (response.data.boards) {
        if (
          this.boards != undefined &&
          el.title != "init" &&
          JSON.stringify(response.data.boards) === JSON.stringify(this.boards)
        ) {
        } else {
          el.title = "";

          let t = document.getElementById("board_table");

          let tb = t.getElementsByTagName("tbody")[0];
          tb.innerHTML = "";

          response.data.boards.forEach((b) => {
            // console.log(b)
            let r = tb.insertRow();
            let c = r.insertCell();
            c.innerHTML = String(b.id) + "(" + b.board_type + ")";
            c.setAttribute("board_id", String(b.id));
            c = r.insertCell();
            c.innerHTML = b.ip;
            c = r.insertCell();
            c.innerHTML = b.hostname;
            c = r.insertCell();
            c.className = "class_" + b.status;
            c.innerHTML = b.status;
            c = r.insertCell();

            let lbl = document.createElement("label");
            lbl.innerText = "";
            lbl.className = "cbx_container";
            let ckmk = document.createElement("span");
            ckmk.className = "checkmark";

            let cbx = document.createElement("input");
            cbx.type = "checkbox";
            cbx.className = "board_table_cbx";
            // cbx.id = "cbx"
            if (b.status === "disconnect") {
              cbx.disabled = "disabled";
            }
            lbl.appendChild(cbx);
            lbl.appendChild(ckmk);

            c.appendChild(lbl);
            c = r.insertCell();
            c.innerHTML = b.msg;
          });

          this.boards = response.data.boards;
        }
      }

      if (response.data.waitingList) {
        if (
          this.waitingList != undefined &&
          el.title != "init" &&
          JSON.stringify(response.data.waitingList) ===
            JSON.stringify(this.boardwaitingLists)
        ) {
          console.log("Same");
        } else {
          el.title = "";
          let t = document.getElementById("waitlist_zone_table");
          let tb = t.getElementsByTagName("tbody")[0];
          tb.innerHTML = "";
          // if(tb!=undefined){
          //     tb.innerHTML=""
          // }else{
          //     tb=document.createElement("tbody")
          //     t.appendChild(tb)
          // }
          // tb = t.getElementsByTagName("tbody")[0]
          // console.log("asd")
          response.data.waitingList.forEach((b) => {
            // console.log(b)
            let r = tb.insertRow();
            let c = r.insertCell();
            c.innerHTML = b.ip + "(" + b.board_type + ")";
            c = r.insertCell();
            c.innerHTML = b.hostname;
            c = r.insertCell();
            let btn_add_config = document.createElement("button");
            btn_add_config.innerText = "add Board";
            btn_add_config.onclick = function () {
              // alert(b.mac)
              axios.get("/api/config/addBoard", {
                params: {
                  hostname: b.hostname,
                },
              });
            };
            let btn_alert = document.createElement("button");
            btn_alert.innerText = "alert Board";
            btn_alert.onclick = function () {
              // alert(b.mac)
              axios.get("/api/config/alert", {
                params: {
                  hostname: b.hostname,
                },
              });
            };
            c.appendChild(btn_add_config);
            c.appendChild(btn_alert);
          });

          // this.boards = response.data
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  smartRenderLayout() {
    clearInterval(this.smartRenderInterval);

    if (!this.renderLayout() && this.visible) {
      this.smartRenderInterval = setInterval(this.smartRenderLayout, 3000);
    }
  }
  renderLayout() {
    // let el = document.getElementById("btnConfig_zone");
    let el = document.getElementById("commandComponent_zone");
    el.title = "init";

    if (el == null) {
      return false;
    }

    //control zone
    {
      function getSelected() {
        let tbody = document.getElementById("board_table").tBodies[0];
        // document.getElementById("board_table").getAttribute
        // document.getElementById("board_table").getElementsByTagName('')[0]
        let id_arr = [];
        for (let j = 0; j < tbody.rows.length; j++) {
          let row = tbody.rows[j];
          if (
            row.cells[4].firstChild.getElementsByTagName("input")[0].checked
          ) {
            id_arr.push(Number(row.cells[0].getAttribute("board_id")));
          }
        }
        return id_arr;
      }

      let self = this;

      let conrtol_zone = document.createElement("div");
      conrtol_zone.id = "conrtol_zone";

      let lbl = document.createElement("label");
      lbl.innerText = "Edit Boards Configuration";
      lbl.className = "cbx_container";
      let ckmk = document.createElement("span");
      ckmk.className = "checkmark";
      let allow_scan = document.createElement("input");
      allow_scan.type = "checkbox";
      allow_scan.id = "chbx_allow_scan";

      allow_scan.checked = true;
      allow_scan.onchange = function () {
        if (this.checked == true) {
          self.enableEditConfig();
        } else {
          self.disableEditConfig();
        }
        // self.allowUpdateBoard = this.
      };
      lbl.appendChild(allow_scan);
      lbl.appendChild(ckmk);

      // let allow_scan_title = document.createElement("label")
      // allow_scan_title.innerText = "Edit Boards Configuration"

      let boards_control_zone = document.createElement("div");
      boards_control_zone.id = "boards_control_zone";

      let btn_upload_timeline = document.createElement("button");
      btn_upload_timeline.innerText = "Upload Timeline";
      btn_upload_timeline.id = "btn_upload";
      btn_upload_timeline.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/upload/timeline", {
            params: {
              ids: id_arr,
              time: 0,
              control: self.mgr.getControl(),
            },
          });
        }
        console.log(id_arr);
      };

      let btn_upload_test = document.createElement("button");
      btn_upload_test.innerText = "Upload Test";
      btn_upload_test.id = "btn_upload_test";
      btn_upload_test.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/upload/test", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_exe_test = document.createElement("button");
      btn_exe_test.innerText = "Execute Test";
      btn_exe_test.id = "btn_play_test";
      btn_exe_test.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/exe_test", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_upload_leds = document.createElement("button");
      btn_upload_leds.innerText = "Upload Led";
      btn_upload_leds.id = "btn_upload";
      btn_upload_leds.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/upload/leds", {
            params: {
              ids: id_arr,
              time: 0,
              control: self.mgr.getControl(),
            },
          });
        }
        console.log(id_arr);
      };

      let btn_compile = document.createElement("button");
      btn_compile.innerText = "Compile";
      btn_compile.id = "btn_compile";
      btn_compile.onclick = function () {
        // axios.get('/api/compile',{
        //     params: {
        //     }
        // })
        axios.post("/api/compile", {
          params: {
            control: self.mgr.getControl(),
          },
        });
      };

      let btn_reconnect = document.createElement("button");
      btn_reconnect.id = "btn_reconnect";
      btn_reconnect.innerText = "Reconnect";
      btn_reconnect.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/reconnect", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_kick = document.createElement("button");
      btn_kick.id = "btn_kick";
      btn_kick.innerText = "Kick";
      btn_kick.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/kick", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_reboot = document.createElement("button");
      btn_reboot.id = "btn_reboot";
      btn_reboot.innerText = "Reboot";
      btn_reboot.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/reboot", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_halt = document.createElement("button");
      btn_halt.id = "btn_halt";
      btn_halt.innerText = "Halt";
      btn_halt.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/halt", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_git_pull = document.createElement("button");
      btn_git_pull.id = "btn_git_pull";
      btn_git_pull.innerText = "Git Pull";
      btn_git_pull.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/git_pull", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_make = document.createElement("button");
      btn_make.id = "btn_make";
      btn_make.innerText = "Make";
      btn_make.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/make", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_prepare = document.createElement("button");
      btn_prepare.innerText = "Prepare";
      btn_prepare.id = "btn_prepare";
      btn_prepare.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/prepare", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      let btn_time_sync = document.createElement("button");
      btn_time_sync.innerText = "Sync Time";
      btn_time_sync.id = "btn_time_sync";
      btn_time_sync.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/time_sync", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      function exe_play() {
        self.mgr.wavesurfer.playPause();
      }

      let countdown_div = document.createElement("div");
      countdown_div.id = "countDown";
      // document.body.appendChild(countdown_div)

      let btn_play = document.createElement("button");
      btn_play.id = "btn_play";
      btn_play.innerText = "Play/Pause";
      btn_play.onclick = function () {
        if (self.mgr.wavesurfer.wavesurfer.isPlaying()) {
          let id_arr = getSelected();
          if (id_arr.length != 0) {
            axios.post("/api/pause", {
              params: {
                ids: id_arr,
                time: 0,
              },
            });
          }
          self.mgr.wavesurfer.playPause();
        } else {
          let id_arr = getSelected();
          let scheduled_time = Date.now() + TIME_WAIT_TO_PLAY;
          if (id_arr.length != 0) {
            axios
              .post("/api/play", {
                params: {
                  ids: id_arr,
                  time: self.mgr.time,
                  start_at_time: scheduled_time,
                },
              })
              .then((response) => {
                console.log("RESPONSE", response);
                setTimeout(function () {
                  exe_play();
                }, scheduled_time - Date.now());
                // while(Date.now() < scheduled_time){
                //     // countdown_div.innerText = (scheduled_time -Date.now())/1000
                // }
                // exe_play()
              });
          }
          // schedule.scheduleJob('42 * * * *', function(){
          // let j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
          //     console.log('Time for tea!');
          //   });
        }

        // document.getElementById("playPause-btn").click()
        // console.log(id_arr)
      };

      let btn_pause = document.createElement("button");
      btn_pause.id = "btn_pause";
      btn_pause.innerText = "Pause";
      btn_pause.onclick = function () {
        let id_arr = getSelected();
        if (id_arr.length != 0) {
          axios.post("/api/pause", {
            params: {
              ids: id_arr,
              time: 0,
            },
          });
        }
        console.log(id_arr);
      };

      boards_control_zone.appendChild(btn_time_sync);
      boards_control_zone.appendChild(btn_compile);
      boards_control_zone.appendChild(btn_upload_leds);
      boards_control_zone.appendChild(btn_upload_timeline);
      boards_control_zone.appendChild(btn_prepare);
      boards_control_zone.appendChild(btn_play);

      // boards_control_zone.appendChild(btn_reconnect)
      boards_control_zone.appendChild(btn_kick);
      boards_control_zone.appendChild(btn_reboot);
      boards_control_zone.appendChild(btn_halt);
      boards_control_zone.appendChild(btn_git_pull);
      boards_control_zone.appendChild(btn_make);

      boards_control_zone.appendChild(btn_upload_test);
      // boards_control_zone.appendChild(btn_exe_test)

      // boards_control_zone.appendChild(btn_pause)

      // conrtol_zone.appendChild(allow_scan)
      // conrtol_zone.appendChild(allow_scan_title)
      conrtol_zone.appendChild(lbl);
      conrtol_zone.appendChild(boards_control_zone);

      el.appendChild(conrtol_zone);
    }

    let panel = document.createElement("div");
    panel.className = "panel_container";
    //  status zone
    {
      let status_zone = document.createElement("div");
      let status_zone_title = document.createElement("h6");
      status_zone.id = "status_zone";
      status_zone.className = "left_panel";
      status_zone_title.innerText = "Boards in Config";
      status_zone.appendChild(status_zone_title);

      let board_table = document.createElement("table");
      board_table.id = "board_table";
      let board_table_h = board_table.createTHead();
      board_table.createTBody();
      let board_table_h_row = board_table_h.insertRow(0);
      let table_header = ["ID", "IP", "HOSTNAME", "Status", "Select", "MSG"];
      for (const y of table_header) {
        let cell = board_table_h_row.insertCell();

        if (y === "Select") {
          let lbl = document.createElement("label");
          lbl.innerText = "Select All";
          lbl.className = "cbx_container";
          let ckmk = document.createElement("span");
          ckmk.className = "checkmark";
          let cbx = document.createElement("input");
          cbx.type = "checkbox";
          cbx.onchange = function () {
            let tbody = document.getElementById("board_table").tBodies[0];

            for (let j = 0; j < tbody.rows.length; j++) {
              let row = tbody.rows[j];
              if (
                row.cells[4].firstChild.getElementsByTagName("input")[0]
                  .disabled
              ) {
                row.cells[4].firstChild.getElementsByTagName(
                  "input"
                )[0].checked = false;
              } else {
                row.cells[4].firstChild.getElementsByTagName(
                  "input"
                )[0].checked = this.checked;
              }
            }
          };
          lbl.append(cbx);
          lbl.append(ckmk);
          cell.appendChild(lbl);
        } else {
          cell.innerHTML = y;
        }
        // cell.className = "handle"
      }
      status_zone.appendChild(board_table);

      panel.appendChild(status_zone);
    }

    //config zone
    {
      let config_zone = document.createElement("div");
      config_zone.id = "config_zone";
      config_zone.className = "right_panel";
      let waitlist_zone = document.createElement("div");
      let waitlist_zone_title = document.createElement("h6");
      waitlist_zone_title.innerText = "Boards Not Registered";

      let waitlist_zone_table = document.createElement("table");
      waitlist_zone_table.id = "waitlist_zone_table";

      {
        let h = waitlist_zone_table.createTHead();
        waitlist_zone_table.createTBody();
        let row = h.insertRow(0);
        let table_header = ["IP", "HOSTNAME", "Select"];
        for (const y of table_header) {
          let cell = row.insertCell();
          cell.innerHTML = y;
          // cell.className = "handle"
          if (y === "Select") {
            cell.className = "btn_control";
          }
        }
      }

      waitlist_zone.appendChild(waitlist_zone_title);

      waitlist_zone.appendChild(waitlist_zone_table);

      config_zone.appendChild(waitlist_zone);

      let btnConfig_zone = document.createElement("div");
      btnConfig_zone.id = "btnConfig_zone";

      let btn_save_config = document.createElement("button");
      btn_save_config.innerText = "Save";
      btn_save_config.onclick = function () {
        const response = axios.get("/api/config/save");
      };

      let btn_reload_config = document.createElement("button");
      btn_reload_config.innerText = "reload";
      btn_reload_config.onclick = function () {
        const response = axios.get("/api/config/reload");
      };

      let btn_clear_config = document.createElement("button");
      btn_clear_config.innerText = "clear";
      btn_clear_config.onclick = function () {
        const response = axios.get("/api/config/clear");
      };

      btnConfig_zone.appendChild(btn_save_config);
      btnConfig_zone.appendChild(btn_reload_config);
      btnConfig_zone.appendChild(btn_clear_config);

      config_zone.appendChild(btnConfig_zone);

      panel.appendChild(config_zone);
    }
    el.appendChild(panel);
    return true;
  }
}

export default Commandcenter;
