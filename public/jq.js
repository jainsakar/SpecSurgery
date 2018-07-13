var image=[{
		//background:"linear-gradient(45deg,rgba(120,100,100,0.5),rgba(255,50,200,0.5))",
		background:"url('http://www.sott.net/image/s18/367844/full/Surgical_Instruments_2_1024x67.jpg')",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundAttachment: "fixed"
	},
	 {
	 	background:"url('https://i.ytimg.com/vi/65aKjByfX5M/maxresdefault.jpg')",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundAttachment: "fixed"
	 },
	{
		background:"url('https://media2.s-nbcnews.com/i/MSNBC/Components/Video/__NEW/nn_10bwi_hospital_130731.jpg')",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundAttachment: "fixed"
	}
];
$("#test").css(image[0]);
$("#test").on("mouseover",function(){
	var i=1;
	setInterval(function(){
		$("#test").fadeOut(2000,function(){
			if(i>2){
				i=0;
			}
			$("#test").css(image[i]);

			$("#test").fadeIn(2000);
			i=i+1;

		})
	},9000);


});
