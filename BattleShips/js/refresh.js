var movePath = [[] , [] , [] , [] , [] , [] , [] , []];
var map = {};
var m_Volume = 30;
var endingFlag = false;
var endingTime;

map.width = 600;
map.height = 400;
map.size = map.width * map.height;
map.check = function(x , y , dx , dy , number , stuck)
{
	if(!( x + dx >= -m_ship[number].radius && x + dx <= map.width - m_ship[number].radius && y + dy >= -m_ship[number].radius && y + dy <= map.height - m_ship[number].radius))
		return false;
	if(stuck)
		return true;
	for(var i = 0 ; i < m_ship.length ; i++)
		if(i != number && !m_ship[i].number)
			if(Math.abs(x + dx - m_ship[i].pos_x) + Math.abs(y + dy - m_ship[i].pos_y) <= 2 * m_Volume)
				return false;
	return true;
};
			
var myDist = new __Smart();

function CheckAllMove(m_ship_number)
{
	var i , moveable = [];
	
	var now_x = [] , target_x = [];
	var now_y = [] , target_y = [];
	
	for(i = 0 ; i < m_ship_number ; i++)
	{
		now_x[i] = target_x[i] = m_ship[i].pos_x;
		now_y[i] = target_y[i] = m_ship[i].pos_y;
		moveable[i] = false;
		if(!m_ship[i].death)
			if(m_ship[i].order[0] == 'm')
			{
				//console.log(i);
				target_x[i] = movePath[i][0].pos_x;
				target_y[i] = movePath[i][0].pos_y;
				moveable[i] = true;
			}
	}
	
	for(i = 0 ; i < m_ship_number ; i++)
		if(!m_ship[i].death)
			for(j = i + 1 ; j < m_ship_number ; j++)
				if(!m_ship[j].death)
					if(__VectorMulti(target_x[i] - target_x[j] , target_y[i] - target_y[j] , target_x[i] - target_x[j] , target_y[i] - target_y[j]) <= 4 * m_Volume * m_Volume)
					{
						if(__VectorMulti(now_x[i] - target_x[j] , now_y[i] - target_y[j] , now_x[i] - target_x[j] , now_y[i] - target_y[j]) <= 4 * m_Volume * m_Volume)
							moveable[j] = false;
						if(__VectorMulti(target_x[i] - now_x[j] , target_y[i] - now_y[j] , target_x[i] - now_x[j] , target_y[i] - now_y[j]) <= 4 * m_Volume * m_Volume)
							moveable[i] = false;
					}
	for(i = 0 ; i < m_ship_number ; i++)
		if(!m_ship[i].death)
			for(j = i + 1 ; j < m_ship_number ; j++)
				if(!m_ship[j].death)
					if(__VectorMulti(target_x[i] - target_x[j] , target_y[i] - target_y[j] , target_x[i] - target_x[j] , target_y[i] - target_y[j]) <= m_Volume * m_Volume)
						moveable[i] = moveable[j] = true;
	for(i = 0 ; i < m_ship_number ; i++)
		if(!m_ship[i].death)
			if (m_ship[i].order[0] == 'm' && m_ship[i].pos_x == movePath[i][0].pos_x && m_ship[i].pos_y == movePath[i][0].pos_y)
				moveable[i] = true;
	//debugger;
	for(i = 0 ; i < m_ship_number ; i++)
		if(!m_ship[i].death && m_ship[i].order[0] != 's')
			if(moveable[i] == false)
			{
				//if(Math.abs(m_ship[i].orientation - movePath[i][0].orientation) > 4)
				//{
					movePath[i] = myDist.query({
													pos_x : m_ship[i].pos_x , 
													pos_y : m_ship[i].pos_y , 
													orientation : m_ship[i].orientation , 
													number : i , 
													speed : m_ship[i].movespeed
												} , 
												{
													pos_x : movePath[i][movePath[i].length - 1].pos_x , 
													pos_y : movePath[i][movePath[i].length - 1].pos_y
												});
					if(movePath[i].length == 0)
						m_ship[i].order = 'stop';
					else m_ship[i].order = 'moveto(' + movePath[i][0].pos_x + ',' + movePath[i][0].pos_y + ',' + (movePath[i][0].orientation - m_ship[i].orientation) + ')';
				//}
				//else
				//{
				//	var d_dir = Math.random() <= 0.5 ? -1 : 1;
				//	movePath[i].unshift({pos_x : now_x[i] , pos_y : now_y[i] , orientation : (m_ship[i].orientation + 24 + d_dir) % 24});
				//	m_ship[i].order = "moveto(" + now_x[i] + "," + now_y[i] + "," + d_dir + ")";
				//}
				
			}
}


function m_refresh()
{
	var i , j , undefined;
	var ele;//element
	
	
	//游戏信息装填检测
	if(m_victory || m_lose)
	{
		m_ship_selected = undefined;
		
		if(endingFlag == false)
		{
			endingFlag = true;
			endingTime = maptime;
		}
		if(endingFlag && (maptime - endingTime) * m_refresh_interval > 2000)
		{
			endingFlag = false;
			if(m_victory) // 进入下一关
				victory();
			else gameover();  //失败结束
		}
	}
	
	maptime++;
	
	//检测碰撞并调整
	
	CheckAllMove(m_ship.length);
	
	//敌方简单AI
	m_victory = m_lose = true;
	for(i = m_ownship ; m_victory && i < m_ship.length ; i++)
		m_victory = m_victory && m_ship[i].death;
	for(j = 0 ; j < m_ownship ; j++)
		m_lose = m_lose && m_ship[j].death;
	for(j = m_ownship ; j < m_ship.length ; j++)
		if(!m_ship[j].death)
		{
			var MinDist = 999999999;
			var oldInstruction = m_ship[j].instruction;
			for(i = 0 ; i < m_ownship ; i++)
				if(!m_ship[i].death)
				{
					var __x = m_ship[i].pos_x - m_ship[j].pos_x;
					var __y = m_ship[i].pos_y - m_ship[j].pos_y;
					if(__x * __x + __y * __y < MinDist)
					{
						m_ship[j].instruction = i;
						MinDist = __x * __x + __y * __y;
					}
				}
			if(m_ship[j].instruction != oldInstruction)
				movePath[j] = [];
		}
				
	
	//下面是实现上一个回合的order并逻辑判断；
	
	
	for (i = 0; i < m_ship.length; i++)//对每艘船实现
	{
		//if(i==0)
		//console.log(m_ship[i].order);
		//console.log(movePath[i]);
		//console.log(maptime);
		
		if(m_ship[i].order.indexOf("moveto") >= 0 )  { //船的平移运动hexuanzhuan
			var s = m_ship[i].order;
			var w = m_ship[i].order.indexOf(',');
			var v = m_ship[i].order.indexOf(')');
			var z = m_ship[i].order.substr(w+1).indexOf(',') + w+1;
			var m_x = Number(s.substring(7, w));
			var m_y = Number(s.substring(w + 1, z));
			var m_r = Number(s.substring(z + 1, v));
			m_r = parseInt(m_r);
			movePath[i].shift();
			
			//console.log(m_y);
			//console.log(m_r);
			//下面用来突变船的坐标并显示
			set_ship_pos(i, m_x, m_y, m_r);
		}
		if (m_ship[i].order == "shoot"){//发炮
			m_fire(m_ship[i].pos_x + m_ship[i].radius, m_ship[i].pos_y + m_ship[i].radius, m_ship[i].target_x, m_ship[i].target_y, 20, i);//最后liang个是弹道速度
		}
		
		
		//计算order的过程
		if (m_ship[i].current_hp <= 0 && m_ship[i].death == false)//船刚死
		{
			m_ship[i].order = "die";
			m_ship[i].death = true;
			//此处应有船死的特技
			ship_sink(i);
		}
		else if(m_ship[i].death == false)
		{
			if(typeof m_ship[i].instruction == 'undefined')
			{
				if(movePath[i].length == 0)
				{
					if(i < m_ownship)
						for(j = m_ownship ; j < m_ship.length ; j++)
							if(!m_ship[j].death)
							{
								var __x = m_ship[i].pos_x - m_ship[j].pos_x;
								var __y = m_ship[i].pos_y - m_ship[j].pos_y;
								if(__x * __x + __y * __y <= m_ship[i].range * m_ship[i].range * 400)
								{
									m_ship[i].instruction = j;
									break;
								}
							}
					m_ship[i].order = 'stop';
				}
				else m_ship[i].order = 'moveto(' + movePath[i][0].pos_x + ',' + movePath[i][0].pos_y + ',' + (movePath[i][0].orientation - m_ship[i].orientation) + ')';
			}
			else if(m_ship[m_ship[i].instruction].death)
			{
				m_ship[i].instruction = undefined;
				m_ship[i].order = 'stop';
			}
			else 
			{
				var __x = m_ship[i].pos_x - m_ship[m_ship[i].instruction].pos_x;
				var __y = m_ship[i].pos_y - m_ship[m_ship[i].instruction].pos_y;
				var __dist = Math.sqrt(__x * __x + __y * __y);
				if(__dist > m_ship[i].range * 20 || maptime - m_ship[i].lastAttack < m_ship[i].attackCD)
				{
					if(movePath[i].length == 0)
						if(__dist > m_ship[i].range * 20)
							movePath[i] = myDist.query({
														pos_x : m_ship[i].pos_x , 
														pos_y : m_ship[i].pos_y , 
														orientation : m_ship[i].orientation , 
														number : i , 
														speed : m_ship[i].movespeed
														} , 
														{
															pos_x : m_ship[m_ship[i].instruction].pos_x , 
															pos_y : m_ship[m_ship[i].instruction].pos_y
														});
						else if(i >= m_ownship)
						{
							var __x = m_ship[i].pos_x - m_ship[m_ship[i].instruction].pos_x;
							var __y = m_ship[i].pos_y - m_ship[m_ship[i].instruction].pos_y;
							var __degree = Math.floor(Math.random() * 6) * Math.PI / 12;
							var __dir_x = Math.cos(__degree);
							var __dir_y = Math.sin(__degree);
							var __pos_x = __x * __dir_x - __y * __dir_y;
							var __pos_y = __x * __dir_y + __y * __dir_x;
							
							if(__pos_x + m_ship[i].radius < 0)
								__pos_x = -m_ship[i].radius;
							if(__pos_x + m_ship[i].radius > map.width)
								__pos_x = map.width - m_ship[i].radius;
							if(__pos_y + m_ship[i].radius < 0)
								__pos_y = -m_ship[i].radius;
							if(__pos_y + m_ship[i].radius > map.height)
								__pos_y = map.height - m_ship[i].radius;
							
							movePath[i] = myDist.query({
														pos_x : m_ship[i].pos_x , 
														pos_y : m_ship[i].pos_y , 
														orientation : m_ship[i].orientation , 
														number : i , 
														speed : m_ship[i].movespeed
														} , 
														{
															pos_x : m_ship[i].pos_x - __pos_x, 
															pos_y : m_ship[i].pos_y - __pos_y
														});
						}
					if(movePath[i].length == 0)
						m_ship[i].order = 'stop';
					else m_ship[i].order = 'moveto(' + movePath[i][0].pos_x + ',' + movePath[i][0].pos_y + ',' + (movePath[i][0].orientation - m_ship[i].orientation) + ')';
				}
				else
				{
					//debugger;
					var angel = (__x * Math.cos(Math.PI / 12 * m_ship[i].orientation) - __y * Math.sin(Math.PI / 12 * m_ship[i].orientation)) / __dist;
					if(m_ship[i].attackStyle == 1 && Math.abs(angel) > 0.25881904  //侧舷炮
					|| m_ship[i].attackStyle == 2 && angel > -0.96592582) // 船首炮
					{
						if((__y * Math.cos(Math.PI / 12 * m_ship[i].orientation) + __x * Math.sin(Math.PI / 12 * m_ship[i].orientation)) < 0)
							if(m_ship[i].attackStyle == 1)
								if(angel > 0)
									m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',-1)';
								else m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',1)';
							else m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',-1)';
						else if(m_ship[i].attackStyle == 1)
							if(angel > 0)
								m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',1)';
							else m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',-1)';
						else m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',1)';
								
						
						movePath[i][0] = {pos_x : m_ship[i].pos_x , pos_y : m_ship[i].pos_y};
					}
					else
					{
						m_ship[i].target_x = m_ship[m_ship[i].instruction].pos_x + m_ship[m_ship[i].instruction].radius;
						m_ship[i].target_y = m_ship[m_ship[i].instruction].pos_y + m_ship[m_ship[i].instruction].radius;
						m_ship[i].order = 'shoot';
						m_ship[i].lastAttack = maptime;
						movePath[i] = [];
					}
				}
			}
		}
		else m_ship[i].order = 'stop';
	}

	//setTimeout("m_refresh()", m_refresh_interval); 
}

function set_ship_pos(i, m_x, m_y, m_r){
	m_ship[i].pos_x = m_x;
	m_ship[i].pos_y = m_y;
	
	m_ship[i].orientation = (m_ship[i].orientation + 24 + m_r) % 24;
	var pic = document.getElementById('m_ship' + i);
	pic.style.left = m_ship[i].pos_x - map_offset_x + 'px';
	pic.style.top = m_ship[i].pos_y - map_offset_y + 'px';
	if (m_r != 0)
		document.getElementById('shippic' + i).src = 'images/ship_' + m_ship[i].orientation + '.png';
	if (m_ship_selected == i){//把选择框一起运动
		var m_circle = document.getElementById('selectcircle');
		m_circle.style.left = m_ship[i].pos_x - map_offset_x + 'px';
		m_circle.style.top = m_ship[i].pos_y - map_offset_y + 'px';
	}
}