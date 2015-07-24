function rightButtonListener(event)
{
	//console.log(event.button);
	if(event.button == 2)
	{
		if(typeof m_ship_selected == 'undefined')
			return;
		if(m_ship_selected >= m_ownship)
			return;
		
		if(m_ship[m_ship_selected].m_type == 0 || m_ship[m_ship_selected].m_type == 3 || m_ship[m_ship_selected].m_type == 6 || m_ship[m_ship_selected].m_type == 7){//我方播放音效
			document.getElementById('you'+ m_ship_selected +'_'+ m_lastsound).play();
			m_lastsound = 3 - m_lastsound;
		}
		
		//console.log(event.clientX);
		//console.log(event.clientY);
		//console.log(m_ship_selected);
		
		
		m_ship[m_ship_selected].instruction = undefined;
		movePath[m_ship_selected] = myDist.query({
													pos_x : m_ship[m_ship_selected].pos_x , 
													pos_y : m_ship[m_ship_selected].pos_y , 
													orientation : m_ship[m_ship_selected].orientation , 
													number : m_ship_selected , 
													speed : m_ship[m_ship_selected].movespeed
												} , 
												{
													pos_x : event.clientX - document.getElementById("m_showwindow").offsetLeft - m_ship[m_ship_selected].radius , 
													pos_y : event.clientY - document.getElementById("m_showwindow").offsetTop - m_ship[m_ship_selected].radius
												});
		if(movePath[m_ship_selected].length == 0)
			m_ship[m_ship_selected].order = 'stop';
		else m_ship[m_ship_selected].order = 'moveto(' + movePath[m_ship_selected][0].pos_x + ',' + movePath[m_ship_selected][0].pos_y + ',' + (movePath[m_ship_selected][0].orientation - m_ship[m_ship_selected].orientation) + ')';
		//console.log(movePath[m_ship_selected]);
	}
}

//var m_loop = setTimeout("m_refresh()", m_refresh_interval); 

function keyListener(event)
{ 
	var e = event || window.event || arguments.callee.caller.arguments[0]; 
	//debugger;
	if(e && e.keyCode==49)
	{ // 按 1键
		if(m_ship[0].death) return;
		m_ship_selected = 0;
		selectship0({button:0});
		select_ship();
	}
	else if(e && e.keyCode==50)
	{ // 按 1键
		if(m_ship[1].death) return;
		m_ship_selected = 1;
		selectship1({button:0});
		select_ship();
	}
	else if(e && e.keyCode==51)
	{ // 按 1键
		if(m_ship[2].death) return;
		m_ship_selected = 2;
		selectship2({button:0});
		select_ship();
	}
}

function select_ship(){//鼠标单击某个舰船
	if (typeof(m_ship_selected) == 'undefined')
		return;
	if (m_ship[m_ship_selected].current_hp <= 0)//船死了
		return;
	var m_select = document.getElementById('selectcircle');
	var m_select_pic = document.getElementById('selectcircle_pic');
	//console.log(m_ship[m_ship_selected].m_type);
	//sounds
	
	
	document.getElementById("zuo"+m_ship_selected+"_"+m_lastsound).play();
	m_lastsound = 3 - m_lastsound;
	if (m_ship[m_ship_selected].m_type == 0 || m_ship[m_ship_selected].m_type == 1 || m_ship[m_ship_selected].m_type == 3 || m_ship[m_ship_selected].m_type == 5 || m_ship[m_ship_selected].m_type == 6){//小框
		m_select_pic.src = "images/selectship.png";
	}
	else if (m_ship[m_ship_selected].m_type == 2 || m_ship[m_ship_selected].m_type == 4 || m_ship[m_ship_selected].m_type == 7){//zhong框
		m_select_pic.src = "images/selectship_100.png";
	}
	else if (m_ship[m_ship_selected].m_type == 8){//小框
		m_select_pic.src = "images/selectship_125.png";
	}
	m_select.style.top = m_ship[m_ship_selected].pos_y - map_offset_y + 'px';
	m_select.style.left = m_ship[m_ship_selected].pos_x - map_offset_x + 'px';
	m_select.style.display = "block";
	//设置右边的东西
	document.getElementById('shipname').innerHTML = m_shipname[m_ship[m_ship_selected].m_type];//待修改
	document.getElementById('hp').innerHTML = 'HP: ' + m_ship[m_ship_selected].current_hp + '/' + m_ship[m_ship_selected].hp;
	document.getElementById('damage').innerHTML = 'Damage: ' + m_ship[m_ship_selected].damage;
	document.getElementById('range').innerHTML = 'Range: ' + m_ship[m_ship_selected].range;
	document.getElementById('speed').innerHTML = 'Movespeed: ' + m_ship[m_ship_selected].movespeed;
}

function selectship0(event)
{
	if(m_ship[0].death) return;
	if(event.button == 0)
		m_ship_selected = 0;
}
function selectship1(event)
{
	if(m_ship[1].death) return;
	if(event.button == 0)
		m_ship_selected = 1;
}
function selectship2(event)
{
	if(m_ship[2].death) return;
	if(event.button == 0)
		m_ship_selected = 2;
}
function selectship3(event)
{
	if(m_ship[3].death) return;
	if(event.button == 0)
		m_ship_selected = 3;
	else if(event.button == 2)
		if(typeof m_ship_selected == 'number')
			if(m_ship_selected < m_ownship)
			{
				m_ship[m_ship_selected].instruction = 3;
				if(m_ship[m_ship_selected].m_type == 0 || m_ship[m_ship_selected].m_type == 3 || m_ship[m_ship_selected].m_type == 6 || m_ship[m_ship_selected].m_type == 7){//我方播放音效
					document.getElementById('you'+ m_ship_selected +'_'+ m_lastsound).play();
					m_lastsound = 3 - m_lastsound;
				}
				event.stopPropagation();
			}
}
function selectship4(event)
{
	if(m_ship[4].death) return;
	if(event.button == 0)
		m_ship_selected = 4;
	else if(event.button == 2)
		if(typeof m_ship_selected == 'number')
			if(m_ship_selected < m_ownship)
			{
				m_ship[m_ship_selected].instruction = 4;
				if(m_ship[m_ship_selected].m_type == 0 || m_ship[m_ship_selected].m_type == 3 || m_ship[m_ship_selected].m_type == 6 || m_ship[m_ship_selected].m_type == 7){//我方播放音效
					document.getElementById('you'+ m_ship_selected +'_'+ m_lastsound).play();
					m_lastsound = 3 - m_lastsound;
				}
				event.stopPropagation();
			}
}
function selectship5(event)
{
	if(m_ship[5].death) return;
	if(event.button == 0)
		m_ship_selected = 5;
	else if(event.button == 2)
		if(typeof m_ship_selected == 'number')
			if(m_ship_selected < m_ownship)
			{
				m_ship[m_ship_selected].instruction = 5;
				if(m_ship[m_ship_selected].m_type == 0 || m_ship[m_ship_selected].m_type == 3 || m_ship[m_ship_selected].m_type == 6 || m_ship[m_ship_selected].m_type == 7){//我方播放音效
					document.getElementById('you'+ m_ship_selected +'_'+ m_lastsound).play();
					m_lastsound = 3 - m_lastsound;
				}
				event.stopPropagation();
			}
}
function selectship6(event)
{
	if(m_ship[6].death) return;
	if(event.button == 0)
		m_ship_selected = 6;
	else if(event.button == 2)
		if(typeof m_ship_selected == 'number')
			if(m_ship_selected < m_ownship)
			{
				m_ship[m_ship_selected].instruction = 6;
				if(m_ship[m_ship_selected].m_type == 0 || m_ship[m_ship_selected].m_type == 3 || m_ship[m_ship_selected].m_type == 6 || m_ship[m_ship_selected].m_type == 7){//我方播放音效
					document.getElementById('you'+ m_ship_selected +'_'+ m_lastsound).play();
					m_lastsound = 3 - m_lastsound;
				}
				event.stopPropagation();
			}
}
function selectship7(event)
{
	if(m_ship[7].death) return;
	if(event.button == 0)
		m_ship_selected = 7;
	else if(event.button == 2)
		if(typeof m_ship_selected == 'number')
			if(m_ship_selected < m_ownship)
			{
				m_ship[m_ship_selected].instruction = 7;
				if(m_ship[m_ship_selected].m_type == 0 || m_ship[m_ship_selected].m_type == 3 || m_ship[m_ship_selected].m_type == 6 || m_ship[m_ship_selected].m_type == 7){//我方播放音效
					document.getElementById('you'+ m_ship_selected +'_'+ m_lastsound).play();
					m_lastsound = 3 - m_lastsound;
				}
				event.stopPropagation();
			}
}