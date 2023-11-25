$(document).ready(function(){
	
  // -[Animasi Scroll]---------------------------
  
  $(".navbar a, footer a[href='#halamanku']").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){
        window.location.hash = hash;
      });
    } 
  });
  
  $(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;
      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });
		
  // -[Prediksi Model]---------------------------

  var INDEX1 = 0; // Index SMS HP 1 (Oknum)
  var INDEX2 = 0; // Index SMS HP 2 (Anda)
  
  // Fungsi untuk memanggil API dan 
  // mengirim SMS ke HP 2 (Anda)
  // ketika tombol send/enter ditekan
  // (dari HP 1 - Oknum)
  $("#chat-submit1").click(function(e) {
    e.preventDefault();
	
	// Set data text input dari pengguna 
	// untuk HP 1 (Oknum)
    var msg = $("#chat-input1").val(); 
    if(msg.trim() == ''){
      return false;
    }
	
	// Menampilkan SMS yg dikirim dari HP 1 (Oknum)
    generate_message1(msg, 'self');

	// Panggil API dengan timeout 1 detik (1000 ms)
    setTimeout(function() {
	  try {
			$.ajax({
			  url     : "/api/deteksi",
			  type    : "POST",
			  data    : {"data" : msg},
			  success : function(res){
				// Ambil hasil prediksi tipe sms dari API
				res_data_prediksi = res['data']
				
				// Tampilkan hasil prediksi tipe sms dan 
				// SMS di HP 2 (Anda) ke halaman web
				msg = '<b>[' + res_data_prediksi + ']</b><br>' + msg;
			    generate_message2(msg, 'user'); 
			  }
			});
		}
		catch(e) {
			// Jika gagal memanggil API, 
			// tampilkan error di console
			console.log("Gagal !");
			console.log(e);
			
			// Jika gagal memanggil API, 
			// tetap tampilkan SMS di HP 2 (Anda)
			msg = '<b>[Gagal]</b><br>' + msg;
			generate_message2(msg, 'user'); 
		} 
    }, 1000)
  })
  
  // Fungsi untuk mengirim SMS ke HP 1 (Oknum)
  // ketika tombol send/enter ditekan
  // (dari HP 2 - Anda)
  $("#chat-submit2").click(function(e) {
    e.preventDefault();
	
	// Set data text input dari pengguna 
	// untuk HP 2 (Anda)
    var msg = $("#chat-input2").val(); 
    if(msg.trim() == ''){
		return false;
    }
	
	// Menampilkan SMS yg dikirim dari HP 2 (Anda)
    generate_message2(msg, 'self');
	  
	// Menampilkan SMS yg dikirim dari HP 2 (Anda)
	// pada HP 1 (Oknum) dengan timeout 1 detik (1000 ms)
    setTimeout(function() {      
		generate_message1(msg, 'user');  
    }, 1000)
    
  })
  
  // Fungsi untuk menampilkan SMS (chat) pada HP 1 (Oknum)
  function generate_message1(msg, type) {
    
	// Tambah nilai index SMS HP 1 (Oknum)
	INDEX1++;
	
	// Isi HTML untuk bagian SMS (chat-logs2) HP 1 (Oknum)
    var str="";
    str += "<div id='cm-msg1-"+INDEX1+"' class=\"chat-msg "+type+"\">";
    str += "<div class=\"cm-msg-text1\">";
    str += msg;
    str += "<\/div><\/div>";
	
	// Tampilkan pesan dengan animasi 
    $(".chat-logs1").append(str);
    $("#cm-msg1-"+INDEX1).hide().fadeIn(300);
	
	// Jika pesan dikirim dari HP 1, hapus text pada input text HP 1
    if(type == 'self'){
		$("#chat-input1").val(''); 
    }    
	
	// Scroll ke pesan terakhir
    $(".chat-logs1").stop().animate(
		{ 
			scrollTop: $(".chat-logs1")[0].scrollHeight
		}, 1000);    
  }  
  
  // Fungsi untuk menampilkan SMS (chat) pada HP 2 (Anda)  
  function generate_message2(msg, type) {
	  
	// Tambah nilai index SMS HP 2 (Anda)
    INDEX2++;
	
	// Isi HTML untuk bagian SMS (chat-logs2) HP 2 (Anda)
    var str="";
    str += "<div id='cm-msg2-"+INDEX2+"' class=\"chat-msg "+type+"\">";
    str += "<div class=\"cm-msg-text2\">";
    str += msg;
    str += "<\/div><\/div>";
	
	// Tampilkan pesan dengan animasi 
    $(".chat-logs2").append(str);
    $("#cm-msg2-"+INDEX2).hide().fadeIn(300);
	
	// Jika pesan dikirim dari HP 2, hapus text pada input text HP 2
    if(type == 'self'){
		$("#chat-input2").val(''); 
    }    
	
	// Scroll ke pesan terakhir
    $(".chat-logs2").stop().animate({ scrollTop: $(".chat-logs2")[0].scrollHeight}, 1000);    
  }  
  
})