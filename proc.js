const ACColor="rgb(147, 196, 126)";
const WAColor="rgb(187, 141, 118)";

async function clearResultSpace(){
	rs=document.getElementById("resultSpace");
	while(rs.firstChild)rs.removeChild(rs.firstChild);
}

async function validateUsername(username){
	response= await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
	if(response.status==200)return true;
	else return false;
}

async function getECRList(){
	return fetch(`https://codeforces.com/api/contest.list`)
	.then(response=>{
		return response.json();
	})
	.then(json=>{
		var cnt=0;

		var arr=[];
		for(var i in json.result){
			c=json.result[i];
			
			if(c.phase!='FINISHED'){
				continue;
			}
			
			spl=c.name.split(" ");
			
			if(spl[0]!='Educational'){
				continue;
			}
			arr.push(c.id);
		}

		return arr.reverse();
	});
}

async function makeTable(){
	var table=document.createElement("table");
	table.border="1";
	row=table.insertRow(-1);
	cell=row.insertCell(-1);
	cell.appendChild(document.createTextNode("Contest"));
	cell.style.backgroundColor="#ddd";
	for(var i=0;i<9;i++){
		cell=row.insertCell(-1);
		cell.appendChild(document.createTextNode(String.fromCharCode(65+i)));
		cell.style.backgroundColor="#ddd";
	}
		
	for(var i=0;i<arr.length;i++){
		row=table.insertRow(-1);
		cell=row.insertCell(-1);
		cell.appendChild(document.createTextNode("ECR"+(i+1)));	
		for(var j=0;j<9;j++){
			cell=row.insertCell(-1);
		}
	}

	return table;
}

function binary_search(arr,x){
	var lb=-1,ub=arr.length;
	while(ub-lb>1){
		var mid=Math.floor((lb+ub)/2);
		if(x<=arr[mid])ub=mid;
		else lb=mid;
	}
	if(ub==arr.length||arr[ub]!=x)return -1;
	else return ub;
}


async function fillTable(table,arr){
	return fetch(`https://codeforces.com/api/problemset.problems`)
	.then(response=>{
		return response.json();
	})
	.then(json=>{
		for(var i in json.result.problems){
			p=json.result.problems[i];
			if(p.index.length>=2&&p.index[1]!="2")continue;
			var k= binary_search(arr,p.contestId);
			if(k==-1)continue;

			var pos=p.index.charCodeAt(0)-65;

			const a1=document.createElement("a");
			a1.href="https://codeforces.com/contest/"+p.contestId+"/problem/"+p.index;
			a1.innerText=p.index+"."+p.name;
			table.rows[k+1].cells[pos+1].appendChild(a1);
		}
		return table;
	});
}

async function paintTable(table,arr,username){
	table=await fetch(`https://codeforces.com/api/user.status?handle=${username}`)
	.then(response=>{
		return response.json();
	})
	.then(json=>{
		for(var i in json.result){
			s=json.result[i];

			if(s.problem.index.length>=2&&s.problem.index[1]!="2")continue;
			var k=binary_search(arr,s.contestId);
			if(k==-1)continue;
			var pos=s.problem.index.charCodeAt(0)-65;

			cell=table.rows[k+1].cells[pos+1];

			if(s.verdict=="OK"){
				cell.style.backgroundColor=ACColor;
			}
			else if(cell.style.backgroundColor!=ACColor){
				cell.style.backgroundColor=WAColor;
			}
		}
		return table;
	});

	for(var i=0;i<arr.length;i++){
		var ok=true;
		for(var j=1;j<table.rows[i].cells.length;j++){
			cell=table.rows[i+1].cells[j];

			if(cell.innerHTML=="")continue;
			if(cell.style.backgroundColor==ACColor)continue;
			ok=false;
		}
		if(ok)table.rows[i+1].cells[0].style.backgroundColor=ACColor;
	}
	return table;
}

async function exec(){
	await clearResultSpace();

	var username=document.form.username.value;
	
	var st=await validateUsername(username);
	if(!st){
		rs=document.getElementById("resultSpace");
		rs.innerHTML="<p>invalid username</p>";
		return;
	}
	

	arr=await getECRList();
	table=await makeTable();

	table=await fillTable(table,arr);
	table=await paintTable(table,arr,username);

	document.getElementById("resultSpace").appendChild(table);
	
}