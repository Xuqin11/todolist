function stopPropagation(e) {
    e = e || window.event;
    if (e.stopPropagation) { //W3C阻止冒泡方法  
        e.stopPropagation();
    } else {
        e.cancelBubble = true; //IE阻止冒泡方法  
    }
}

// 注册登录按钮
var user = document.querySelector('.user');
var userWindow = document.querySelector('.userWindow');
var userWindowClose = document.querySelector('.userWindow_top span');
var userName = document.querySelector('.userName');
var password = document.querySelector('.password');
var btn_register = document.querySelector('.btn_register');
var btn_login = document.querySelector('.btn_login');
var id = document.querySelector('.id');

user.addEventListener('click', function () {
    userWindow.style.display = 'block';
})
userWindowClose.addEventListener('click', function () {
    userWindow.style.display = 'none';
    userName.value = '';
    password.value = '';
})

// 注册
if (window.localStorage.userArr) {
    var array = JSON.parse(window.localStorage.userArr);
} else {
    var array = [];
}

btn_register.addEventListener('click', function () {
    if (userName.value == '') {
        alert('请输入用户名')
    } else if (password.value == '') {
        alert('请输入密码')
    } else {
        for (var i = 0; i < array.length; i++) {
            if (userName.value === array[i].userName) {
                alert('该账号已存在');
                return;
            }
        }
        var obj = { userName: userName.value, password: password.value };
        array.push(obj);
        window.localStorage.userArr = JSON.stringify(array);
        userWindow.style.display = 'none';
        userName.value = '';
        password.value = '';
        id.innerText = array[array.length - 1].userName;
        userNumber(array.length - 1);
        alert('创建用户成功');
        missionList();
        showfinishList();
    }
})

// 登录
btn_login.addEventListener('click', function () {
    for (var i = 0; i < array.length; i++) {
        var flag = false;
        var index;
        for (var i = 0; i < array.length; i++) {
            if (userName.value === array[i].userName) {
                flag = true;
                index = i;
            }
        }
        if (flag) {
            if (password.value === array[index].password) {
                alert('登录成功');
                id.innerText = array[index].userName;
                userWindow.style.display = 'none';
                userName.value = '';
                password.value = '';
                userNumber(index);
                missionList();
                showfinishList();
            } else {
                alert('密码错误');
            }
        } else {
            alert('该账号不存在');
        }
    }
})
// 刷新页面后仍然保持登录状态
function userNumber(index) {
    localStorage.removeItem('number');
    localStorage.setItem('number', index);
}
var number = localStorage.getItem('number');
if (array.length != 0) {
    id.innerText = array[number].userName;
}

// 切边栏切换
var sideBar_first = document.querySelectorAll('.sideBar-first div');
var main = document.querySelectorAll('.main div');
for (var i = 0; i < sideBar_first.length; i++) {
    sideBar_first[i].setAttribute('index', i);
    sideBar_first[i].addEventListener('click', function () {
        for (var i = 0; i < sideBar_first.length; i++) {
            sideBar_first[i].classList.remove('current_1');
        }
        this.classList.add('current_1');
        var index = this.getAttribute('index');
        for (var i = 0; i < main.length; i++) {
            main[i].style.display = 'none';
        }
        main[index].style.display = 'block';
    })
}

// 任务模块中的添加任务
var mission_container_span = document.querySelector('.mission_container span');
var mission_container_input = document.querySelector('.mission_container input');
var unfinish = document.querySelector('.unfinish');
var finishLi = document.querySelectorAll('.finish li');

mission_container_span.addEventListener('click', function () {
    mission_container_input.focus();
    focus();
    showUnfinishList();
})
mission_container_input.onfocus = function () {
    focus();
    showUnfinishList();
}
mission_container_input.onblur = function () {
    blur();
}

// 输入框获得焦点
function focus() {
    if (mission_container_input.value == '添加任务') {
        mission_container_input.value = '';
    }
}
// 输入框失去焦点
function blur() {
    if (mission_container_input.value == '') {
        mission_container_input.value = '添加任务';
    }
}
// 按下回车键添加新任务
function showUnfinishList() {
    document.onkeydown = function (event) {
        var e = e || window.event;
        if (e && e.keyCode == 13 && mission_container_input.value !== '添加任务' && mission_container_input.value !== '') {
            var unfinishList = document.createElement('li');
            unfinishList.innerHTML = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-yuanquan"></use></svg>' + mission_container_input.value;
            if (array[localStorage.getItem('number')].data_unfinish) {
                var data_unfinish = mission_container_input.value;
                array[localStorage.getItem('number')].data_unfinish.push(data_unfinish);
            } else {
                array[localStorage.getItem('number')].data_unfinish = [mission_container_input.value]
            }
            window.localStorage.userArr = JSON.stringify(array);
            unfinish.appendChild(unfinishList);
            mission_container_input.blur();
            mission_container_input.value = '添加任务';
            changeUnfinish();
            missionList();
        }
    }
}

// 展示任务列表中的待办事项
missionList();
function missionList() {
    var data = JSON.parse(localStorage.userArr);
    unfinish.innerHTML = '';
    if (data[localStorage.getItem('number')].data_unfinish) {
        for (var i = 0; i < data[localStorage.getItem('number')].data_unfinish.length; i++) {
            var unfinishList = document.createElement('li');
            unfinishList.innerHTML = '<svg class="icon" aria-hidden="true" index=><use xlink:href="#icon-yuanquan"></use></svg>' + data[localStorage.getItem("number")].data_unfinish[i];
            unfinishList.children[0].setAttribute('index', i);
            unfinish.appendChild(unfinishList);
        }
    }
    // 待办事项的勾选状态
    changeUnfinish();
    // 右键菜单栏
    let unfinishListAll = unfinish.children;
    rightMenu1(unfinishListAll);
}

// 已完成事项的右键菜单栏
let menu = document.querySelector('.menu');
function rightMenu2(finishListAll) {
    for (let i = 0; i < finishListAll.length; i++) {
        finishListAll[i].oncontextmenu = function (e) {
            e.preventDefault();
            var e = e || window.event;
            let x = e.clientX;
            let y = e.clientY;
            menu.style.display = 'block';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            let missionLi = this;
            let flag = 1;
            menu.children[0].onclick = function () {
                edit(missionLi, flag);
                menu.style.display = 'none';
                stopPropagation();
            }
            menu.children[1].onclick = function () {
                removeMission(missionLi, flag);
                menu.style.display = 'none';
                stopPropagation();
            }
        }
    }
    document.addEventListener('click', () => {
        menu.display = 'none';
    })
}

// 待办事项的右键菜单栏
function rightMenu1(unfinishListAll) {
    for (let i = 0; i < unfinishListAll.length; i++) {
        unfinishListAll[i].oncontextmenu = function (e) {
            e.preventDefault();
            var e = e || window.event;
            let x = e.clientX;
            let y = e.clientY;
            console.log(x, y);
            menu.style.display = 'block';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            let missionLi = this;
            let flag = 0;
            menu.children[0].onclick = function () {
                edit(missionLi, flag);
                menu.style.display = 'none';
                stopPropagation();
            }
            menu.children[1].onclick = function () {
                removeMission(missionLi, flag);
                menu.style.display = 'none';
                stopPropagation();
            }
        }
    }
    document.addEventListener('click', () => {
        menu.style.display = 'none';
    })
}

// 事项的修改
const edit = (missionLi, flag) => {
    // console.log(flag);
    console.log('2');
    let index = missionLi.children[0].getAttribute('index');
    let editInput = document.createElement('input');
    editInput.value = missionLi.innerText;
    missionLi.innerHTML = '';
    missionLi.appendChild(editInput);
    editInput.focus()
    document.onkeydown = function () {
        var e = e || window.event;
        if (e && e.keyCode == 13 && editInput.value !== '') {
            var newMission = editInput.value;
            if (flag === 0) {
                array[localStorage.getItem('number')].data_unfinish[index] = newMission;
                window.localStorage.userArr = JSON.stringify(array);
            } else {
                array[localStorage.getItem('number')].data_finish[index] = newMission;
                window.localStorage.userArr = JSON.stringify(array);
            }
            missionList();
            showfinishList();
        }
        if (e && e.keyCode == 13 && editInput.value == '') {
            missionList();
            showfinishList();
        }
    }
    document.addEventListener('click', () => {
        missionList();
        showfinishList();
    })
}

// 事项的删除
const removeMission = (missionLi, flag) => {
    console.log(flag);
    // console.log(deleteMission);
    let index = missionLi.children[0].getAttribute('index');
    if (flag === 0) {
        array[localStorage.getItem('number')].data_unfinish.splice(index, 1);
        window.localStorage.userArr = JSON.stringify(array);
    } else {
        array[localStorage.getItem('number')].data_finish.splice(index, 1);
        window.localStorage.userArr = JSON.stringify(array);
    }
    missionList();
    showfinishList();
}


// 待办事项的勾选状态
var finish = document.querySelector('.finish');
var unfinish = document.querySelector('.unfinish');
function changeUnfinish() {
    console.log('11');
    if (array[localStorage.getItem('number')].data_unfinish) {
        for (var i = 0; i < array[localStorage.getItem('number')].data_unfinish.length; i++) {
            unfinish.children[i].children[0].onclick = function () {
                var index = this.getAttribute('index');
                let finishMission = array[localStorage.getItem('number')].data_unfinish.splice(index, 1);
                window.localStorage.userArr = JSON.stringify(finishMission);
                unFinshList(finishMission[0]);
                missionList();
                showfinishList();
            }
        }
    }
}

// 点击完成时将任务移至已完成的对象中
function unFinshList(finishMission) {
    if (array[localStorage.getItem('number')].data_finish) {
        var data_finish = finishMission;
        array[localStorage.getItem('number')].data_finish.push(data_finish);
    } else {
        array[localStorage.getItem('number')].data_finish = [finishMission];
    }
    window.localStorage.userArr = JSON.stringify(array);
    showfinishList();
}

// 展示已完成的任务
showfinishList();
function showfinishList() {
    var data = JSON.parse(localStorage.userArr);
    finish.innerHTML = '';
    if (array[localStorage.getItem('number')].data_finish) {
        var finish_header = document.createElement('h4');
        finish_header.innerText = '已完成';
        finish.appendChild(finish_header);
        for (var i = 0; i < array[localStorage.getItem('number')].data_finish.length; i++) {
            var finishList = document.createElement('li');
            finishList.innerHTML = '<svg class="icon" aria-hidden="true" index=><use xlink:href="#icon-yuanquan"></use></svg>' + data[localStorage.getItem("number")].data_finish[i];
            finishList.children[0].setAttribute('index', i);
            finish.appendChild(finishList);
        }
    }
    if (array[localStorage.getItem('number')].data_finish) {
        moveFinishToUnfinish();
    }
    let finishLi = document.querySelectorAll('.finish li');
    rightMenu2(finishLi);
}

// 将已完成的任务移至未完成的任务中
if (array[localStorage.getItem('number')].data_finish) {
    moveFinishToUnfinish();
}
function moveFinishToUnfinish() {
    for (var i = 0; i < array[localStorage.getItem('number')].data_finish.length; i++) {
        finish.children[i + 1].children[0].addEventListener('click', function () {
            var index = this.getAttribute('index');
            let unFinishMission = array[localStorage.getItem('number')].data_finish.splice(index, 1);
            array[localStorage.getItem('number')].data_unfinish.push(unFinishMission[0]);
            window.localStorage.userArr = JSON.stringify(array);
            showfinishList();
            missionList();
            // moveFinishToUnfinish();
        })
    }
}
// window.localStorage.clear();
