function __PriorityQueue()
{
	this.container = new Array();
	this.length = 0;
	this.clear = function()
	{
		this.container = [];
		this.length = 0;
	}
	
	this.push = function(data)
	{
		this.container.push(data);
		this.length++;
		this.__up();
	}
	
	this.top = function()
	{
		if(this.length != 0)
			return this.container[0];
		else return null;
	}
	
	this.pop = function()
	{
		if(this.length == 0)
			return;
		
		this.length--;
		this.container[0] = this.container[this.length];
		this.container.pop();
		this.__down();
	}
	
	this.__up = function()
	{
		var now = this.length - 1 , pre;
		var iter = this.container[now];
		
		while(now != 0)
		{
			pre = Math.floor((now + 1) / 2) - 1;
			if(this.container[pre].dist + this.container[pre].step > iter.dist + iter.step)
				this.container[now] = this.container[pre];
			else break;
			now = pre;
		}
		this.container[now] = iter;
	}
	
	this.__down = function()
	{
		var now = 0 , next;
		var iter = this.container[0];
		
		while((now + 1) * 2 <= this.length)
		{
			next = now * 2 + 1;
			if(next + 2 <= this.length && 
			  this.container[next].dist + this.container[next].step > this.container[next + 1].dist + this.container[next + 1].step)
					next++;
			if(this.container[next].dist + this.container[next].step < iter.dist + iter.step)
				this.container[now] = this.container[next];
			else break;
			now = next;
		}
		this.container[now] = iter;
	}
	return this;
}

function __Hash()
{
	this.length = 1500007;
	this.container = new Array(this.length);
	this.clear = function()
	{
		this.container = new Array(this.length);
	}
	this.check = function(status)
	{
		var f = ((status.pos_y + 75) * map.width + status.pos_x + 75) + map.size * ((status.angularVelocity + 3) * 24 + status.orientation);
		for(i = f % this.length ; i < this.length ; i++)
		{
			if(!this.container[i])
			{
				this.container[i] = f;
				return true;
			}
			else if(this.container[i] == f)
				return false;
		}
	}
}

function __FastSqrt(x)
{
	var temp = (((Number(x))&0xff7fffff)>>1)+(64<<23);  
    var val = temp , last;   
    do  
    {  
        last = val;  
        val =(val + x / val) / 2;  
    }while(Math.abs(val - last) > 1e-6);  
    return val;  
}

function __VectorMulti(x1 , y1 , x2 , y2)
{
	return x1 * x2 + y1 * y2;
}

function __AstarFunction(status , target , dx , dy , speed)
{
	var x = target.pos_x - status.pos_x - dx;
	var y = target.pos_y - status.pos_y - dy;
	
	var dir_x = Math.cos(Math.Pi / 12 * ((status.orientation + status.angularVelocity + 24) % 24));
	var dir_y = -Math.sin(Math.Pi / 12 * ((status.orientation + status.angularVelocity + 24) % 24));
	
	return __FastSqrt(__VectorMulti(x , y , x , y)) / speed / __VectorMulti(x , y , dir_x , dir_y);
}

function __Smart()
{
	hash = new __Hash();
	priorityQueue = new __PriorityQueue();
	
	this.query = function (status , target)
	{
		var speed = status.speed;
		var closed , stuck = false;
		var result = new Array();
		var dx , dy;
		var limit = 0;
		
		//console.log(status);
		//console.log(target);
		
		hash.clear();
		priorityQueue.clear();
		
		if(hash.check({pos_x : status.pos_x , pos_y : status.pos_y , orientation : status.orientation , angularVelocity : 0}))
			priorityQueue.push({
				pos_x : status.pos_x , 
				pos_y : status.pos_y , 
				orientation : status.orientation , 
				angularVelocity : 0 , 
				step : 0 , 
				prev : null , 
				dist : (Math.abs(target.pos_x - status.pos_x) + Math.abs(target.pos_y - status.pos_y)) / speed
			});
		
		
		for(var i = 0 ; i < m_ship.length ; i++)
			if(i != status.number)
				if(Math.abs(m_ship[i].pos_x - status.pos_x) + Math.abs(m_ship[i].pos_y - status.pos_y) <= m_Volume - status.speed)
					stuck = true;
		
		//console.log(status.pos_x + "," + status.pos_y);
		//console.log(target.pos_x + "," + target.pos_y);
		for( ; ; )
		{
			limit++;
			closed = priorityQueue.top();
			//alert(closed.pos_x + "," + closed.pos_y + "," + closed.orientation + "," + closed.angularVelocity + "," + closed.step + "," + closed.dist + "," + priorityQueue.length);
			//debugger;
			//console.log(closed);
			if(!closed || closed.dist < 0.2 && closed.angularVelocity == 0 || limit > 1000)
			{
				while(closed && closed.prev != null)
				{
					result[closed.step - 1] = {pos_x : closed.pos_x , pos_y : closed.pos_y , orientation : closed.orientation};
					closed = closed.prev;
				}
				break;
			}
			dx = Math.cos(Math.PI / 12 * closed.orientation) * speed; 
			dy = -Math.sin(Math.PI / 12 * closed.orientation) * speed; 
			
			if(map.check(closed.pos_x , closed.pos_y , dx , dy , status.number , stuck))
			{
				if(closed.angularVelocity == 3 || closed.angularVelocity == -3 || closed.angularVelocity == 0)
					if(hash.check({
									pos_x : Math.floor(closed.pos_x + dx) , 
									pos_y : Math.floor(closed.pos_y + dy) , 
									orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
									angularVelocity : closed.angularVelocity
								  }))
						priorityQueue.push({
							pos_x : Math.floor(closed.pos_x + dx) , 
							pos_y : Math.floor(closed.pos_y + dy) , 
							orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
							angularVelocity : closed.angularVelocity ,
							step : closed.step + 1 , 
							prev : closed , 
							dist : (Math.abs(target.pos_x - Math.floor(closed.pos_x + dx)) + Math.abs(target.pos_y - Math.floor(closed.pos_y + dy))) / speed
						});
					
				if(closed.angularVelocity != 3)
					if(hash.check({
									pos_x : Math.floor(closed.pos_x + dx) , 
									pos_y : Math.floor(closed.pos_y + dy) , 
									orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
									angularVelocity : closed.angularVelocity + 1
								  }))
						priorityQueue.push({
							pos_x : Math.ceil(closed.pos_x + dx) , 
							pos_y : Math.ceil(closed.pos_y + dy) , 
							orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
							angularVelocity : closed.angularVelocity + 1 ,
							step : closed.step + 1 , 
							prev : closed , 
							dist : (Math.abs(target.pos_x - Math.floor(closed.pos_x + dx)) + Math.abs(target.pos_y - Math.floor(closed.pos_y + dy))) / speed
						});
					
				if(closed.angularVelocity != -3)
					if(hash.check({
									pos_x : Math.floor(closed.pos_x + dx) , 
									pos_y : Math.floor(closed.pos_y + dy) , 
									orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
									angularVelocity : closed.angularVelocity - 1
								  }))
						priorityQueue.push({
							pos_x : Math.ceil(closed.pos_x + dx) , 
							pos_y : Math.ceil(closed.pos_y + dy) , 
							orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
							angularVelocity : closed.angularVelocity - 1 ,
							step : closed.step + 1 , 
							prev : closed , 
							dist : (Math.abs(target.pos_x - Math.floor(closed.pos_x + dx)) + Math.abs(target.pos_y - Math.floor(closed.pos_y + dy))) / speed
						});
			}
			if(closed.angularVelocity == 3 || closed.angularVelocity == -3 || closed.angularVelocity == 0)
				if(hash.check({
								pos_x : Math.floor(closed.pos_x) , 
								pos_y : Math.floor(closed.pos_y) , 
								orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
								angularVelocity : closed.angularVelocity
								}))
					priorityQueue.push({
						pos_x : Math.floor(closed.pos_x) , 
						pos_y : Math.floor(closed.pos_y) , 
						orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
						angularVelocity : closed.angularVelocity ,
						step : closed.step + 1 , 
						prev : closed , 
						dist : (Math.abs(target.pos_x - Math.floor(closed.pos_x)) + Math.abs(target.pos_y - Math.floor(closed.pos_y))) / speed
					});
					
			if(closed.angularVelocity != 3)
				if(hash.check({
								pos_x : Math.floor(closed.pos_x) , 
								pos_y : Math.floor(closed.pos_y) , 
								orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
								angularVelocity : closed.angularVelocity + 1
							  }))
					priorityQueue.push({
						pos_x : Math.ceil(closed.pos_x) , 
						pos_y : Math.ceil(closed.pos_y) , 
						orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
						angularVelocity : closed.angularVelocity + 1 ,
						step : closed.step + 1 , 
						prev : closed , 
						dist : (Math.abs(target.pos_x - Math.floor(closed.pos_x)) + Math.abs(target.pos_y - Math.floor(closed.pos_y))) / speed
					});
					
			if(closed.angularVelocity != -3)
				if(hash.check({
								pos_x : Math.floor(closed.pos_x) , 
								pos_y : Math.floor(closed.pos_y) , 
								orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
								angularVelocity : closed.angularVelocity - 1
								 }))
					priorityQueue.push({
						pos_x : Math.ceil(closed.pos_x) , 
						pos_y : Math.ceil(closed.pos_y) , 
						orientation : (closed.orientation + closed.angularVelocity + 24) % 24 ,
						angularVelocity : closed.angularVelocity - 1 ,
						step : closed.step + 1 , 
						prev : closed , 
						dist : (Math.abs(target.pos_x - Math.floor(closed.pos_x)) + Math.abs(target.pos_y - Math.floor(closed.pos_y))) / speed
					});
			priorityQueue.pop();
		}
		
		return result;
	}
	return this;
}