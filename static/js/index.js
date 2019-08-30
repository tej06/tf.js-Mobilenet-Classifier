$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    //Load the model
    var net;
    async function load_model() {
      console.log('Loading mobilenet');
      net = await mobilenet.load();
      console.log('Successfully loaded model');
    }
    load_model();

    // Predict
    $('#btn-predict').click(async function () {
        var reader = new FileReader();
        var form_data = new FormData($('#upload-file')[0]);
        var file = form_data.get("image");
        reader.addEventListener("load", async function(){
          var image = new Image();
          image.src = reader.result;
          image.title = file.name;
          //image.height = 224;
          //image.width = 224;
          // Show loading animation
          $(this).hide();
          $('.loader').show();
          const result = await net.classify(image)
          const data = `
            Prediction: ${result[0].className}\n
            Probability: ${result[0].probability}
          `;
          $('.loader').hide();
          $('#result').fadeIn(600);
          $('#result').text(data);
      }, false);
      reader.readAsDataURL(file);
    });
});
