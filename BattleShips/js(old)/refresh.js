var movePath = [[] , [] , [] , [] , [] , [] , [] , []];
var map = {};
var m_Volume = 30;

map.width = 600;
map.height = 400;
map.size = map.width * map.height;

map.check = function(x , y , dx , dy , number , stuck)
{
	if(!( x + dx >= -37 && x + dx <= map.width - 37 && y + dy >= -37 && y + dy <= map.height - 37))
		return false;
	if(stuck)
		return true;
	for(var i = 0 ; i < m_ship.length ; i++)
		if(i != number && !m_ship[i].death)
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
	//debugger;
	for(i = 0 ; i < m_ship_number ; i++)
		if(!m_ship[i].death && m_ship[i].order[0] != 's')
			if(moveable[i] == false)
			{
				if(Math.abs(m_ship[i].orientation - movePath[i][0].orientation) > 4)
				{
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
				}
				else
				{
					movePath[i].unshift({pos_x : now_x[i] , pos_y : now_y[i] , orientation : (m_ship[i].orientation + 25) % 24});
					m_ship[i].order = "moveto(" + now_x[i] + "," + now_y[i] + ",1)";
				}
				
			}
}

function checkShoot(me , enemy)
{
	
}


function m_refresh()
{
	maptime++;
	
	//检测碰撞并调整
	
	CheckAllMove(m_ship.length);
	
	//下面是实现上一个回合的order并逻辑判断；
	var i;
	var ele;//element
	
	for(i = 3 ; i < m_ship.length ; i++)
	{
		if(!m_ship[0].death)
			m_ship[i].instruction = 0;
		else if(!m_ship[1].death)
			m_ship[i].instruction = 1;
		else m_ship[i].instruction = 2;
	}
	
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
					m_ship[i].order = 'stop';
				else m_ship[i].order = 'moveto(' + movePath[i][0].pos_x + ',' + movePath[i][0].pos_y + ',' + (movePath[i][0].orientation - m_ship[i].orientation) + ')';
			}
			else 
			{
				var __x = m_ship[i].pos_x - m_ship[m_ship[i].instruction].pos_x;
				var __y = m_ship[i].pos_y - m_ship[m_ship[i].instruction].pos_y;
				var __dist = Math.sqrt(__x * __x + __y * __y);
				if(__dist > m_ship[i].range * 20)
				{
					if(movePath[i].length == 0)
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
					if(movePath[i].length == 0)
						m_ship[i].order = 'stop';
					else m_ship[i].order = 'moveto(' + movePath[i][0].pos_x + ',' + movePath[i][0].pos_y + ',' + (movePath[i][0].orientation - m_ship[i].orientation) + ')';
				}
				else
				{
					//debugger;
					var angel = (__x * Math.cos(Math.PI / 12 * m_ship[i].orientation) - __y * Math.sin(Math.PI / 12 * m_ship[i].orientation)) / __dist;
					if(m_ship[i].attackStyle == 1 && Math.abs(angel) > 0.25881904  //侧舷炮
					|| m_ship[i].attackStyle == 2 && angel < 0.96592582)
					{
						if((__y * Math.cos(Math.PI / 12 * m_ship[i].orientation) + __x * Math.sin(Math.PI / 12 * m_ship[i].orientation)) < 0)
							if(m_ship[i].attackStyle == 1)
								if(angel > 0)
									m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',-1)';
								else m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',1)';
							else m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',1)';
						else if(m_ship[i].attackStyle == 2)
							if(angel > 0)
								m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',1)';
							else m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',-1)';
						else m_ship[i].order = 'moveto(' + m_ship[i].pos_x + ',' + m_ship[i].pos_y + ',-1)';
								
						
						movePath[i][0] = {pos_x : m_ship[i].pos_x , pos_y : m_ship[i].pos_y};
					}
					else
					{
						if(maptime - m_ship[i].lastAttack >= m_ship[i].attackCD)
						{
							m_ship[i].target_x = m_ship[m_ship[i].instruction].pos_x + m_ship[m_ship[i].instruction].radius;
							m_ship[i].target_y = m_ship[m_ship[i].instruction].pos_y + m_ship[m_ship[i].instruction].radius;
							m_ship[i].order = 'shoot';
							m_ship[i].lastAttack = maptime;
						}
						else m_ship[i].order = 'stop';
						movePath[i] = [];
					}
				}
			}
		}
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