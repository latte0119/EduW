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
	for(var i=0;i<7;i++){
		cell=row.insertCell(-1);
		cell.appendChild(document.createTextNode(String.fromCharCode(65+i)));
		cell.style.backgroundColor="#ddd";
	}
		
	for(var i=0;i<arr.length;i++){
		row=table.insertRow(-1);
		cell=row.insertCell(-1);
		cell.appendChild(document.createTextNode("ECR"+(i+1)));	
		for(var j=0;j<7;j++){
			cell=row.insertCell(-1);
		}
	}

	return table;
}

/*
async function binary_search(arr,x){
	

	

}
*/

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


async function uku(table,arr){
	fetch(`https://codeforces.com/api/problemset.problems`)
	.then(response=>{
		return response.json();
	})
	.then(json=>{
		for(var i in json.result.problems){
			p=json.result.problems[i];
			if(p.index.length>=2&&p.index[1]!="2")continue;
			var k= binary_search(arr,p.contestId);
			if(k==-1)continue;

			if(39<=k&&k<=40)continue;
			var pos=p.index.charCodeAt(0)-65;

			const a1=document.createElement("a");
			a1.href="https://codeforces.com/contest/"+p.contestId+"/problem/"+p.index;
			a1.innerText=p.index+"."+p.name;
			table.rows[k+1].cells[pos+1].appendChild(a1);
		}

	});

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

	await uku(table,arr);
	document.getElementById("resultSpace").appendChild(table);
	
}