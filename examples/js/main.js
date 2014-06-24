$(document).ready(function(){
	(function(){
		// datas
		var datas = [{"id":"1","nom":"title 1","description":"description 1","imgSrc":"http://bacasable-lab.fr/lab/slider/img/figaro-1.jpg"},
				{"id":"2","nom":"title 2","description":"description 2","imgSrc":"http://bacasable-lab.fr/lab/slider/img/figaro-2.jpg"},
				{"id":"3","nom":"title 3","description":"description 3","imgSrc":"http://bacasable-lab.fr/lab/slider/img/figaro-3.jpg"},
				{"id":"4","nom":"title 4","description":"description 4","imgSrc":"http://bacasable-lab.fr/lab/slider/img/figaro-4.jpg"},
				{"id":"5","nom":"title 5","description":"description 5","imgSrc":"http://bacasable-lab.fr/lab/slider/img/figaro-5.jpg"},
				{"id":"6","nom":"title 6","description":"description 6","imgSrc":"http://bacasable-lab.fr/lab/slider/img/figaro-6.jpg"}];
		// anim type
		var anims = ["diagonales", "squares", "circles"];
		for (i in anims) {
			$("#animationPicker").append('<option value="'+anims[i]+'">'+anims[i]+'</option>');
		}
		var gallery = new SvgGallery({
						_item : 'canvas',
						//~ _dataURL : 'example.json',
						_data : datas,
						_duration : 500,
						_width : 1024,
						_height : 576,
						_transition : anims[0],
						onclick : function () { console.log("test a", this.data("nom"), this.data("description")); },
						onanimate : function () {
							// a callback after the animation is done
						}
					});
		gallery.init()					
		$("#animationPicker").change(function(){
			gallery.options._transition = $(this).val();
		});
	})();
});