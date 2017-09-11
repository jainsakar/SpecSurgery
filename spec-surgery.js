var display=document.querySelector(".navbar-header button");
var selected=document.querySelectorAll("#bs-example-navbar-collapse-1 ul li");
var sidebar=document.querySelector("#sidebar");
var sidesub_a=document.querySelectorAll(".items a");
var sidesubsub=document.querySelectorAll(".items ul ");
var sidesub_li=document.querySelectorAll(".items");

display.addEventListener("click",function(){
sidebar.classList.toggle("disp");
});
for(var i=0;i<5;i++){

selected[i].addEventListener("click",function(){
selected[0].classList.remove("active");
selected[1].classList.remove("active");
selected[2].classList.remove("active");
selected[3].classList.remove("active");
selected[4].classList.remove("active");
this.classList.add("active");



});

}
// back.addEventListener("mouseover",function(){
// 	setInterval(function(){
// 		back.style.background="url('http://www.onextrapixel.com/wp-content/uploads/2014/08/3-Bolt.jpg')";
// 		back.style.backgroundSize="cover";
// 		back.style.backgroundRepeat="no-repeat";
// 	},5000);
	

// });


// for(var i=0;i<3;i++){
// 	if(i===0){
// 		sidesub_a[i].addEventListener("click",function(){
// 			sidesub_li[1].classList.remove("makewhite");
// 			sidesub_li[2].classList.remove("makewhite");
// 			sidesub_li[0].classList.toggle("makewhite");
// 			sidesubsub[1].classList.remove("makevisible");	
// 			sidesubsub[2].classList.remove("makevisible");	
// 			sidesubsub[0].classList.toggle("makevisible");	
// 			// body...

// 	});
// 	}
// 	if(i===1){
// 		sidesub_a[i].addEventListener("click",function(){
// 			sidesub_li[0].classList.remove("makewhite");
// 			sidesub_li[2].classList.remove("makewhite");
// 			sidesub_li[1].classList.toggle("makewhite");
// 			sidesubsub[0].classList.remove("makevisible");	
// 			sidesubsub[2].classList.remove("makevisible");
// 			sidesubsub[1].classList.toggle("makevisible");	// body...

// 	});
// 	}
// 	if(i===2){
// 		sidesub_a[i].addEventListener("click",function(){
// 			sidesub_li[1].classList.remove("makewhite");
// 			sidesub_li[0].classList.remove("makewhite");
// 			sidesub_li[2].classList.toggle("makewhite");
// 			sidesubsub[1].classList.remove("makevisible");	
// 			sidesubsub[0].classList.remove("makevisible");
// 			sidesubsub[2].classList.toggle("makevisible");	// body...

// 	});
// 	}
	
// }
