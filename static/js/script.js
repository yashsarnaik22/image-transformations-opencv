input = {
  "input":null,
  "scaling": {  
    "scaling":null,
    "s_value":0
  },
  "rotation":0,

  "translation":{
    "x_val":0,
    "y_val":0
  },
  "interpolation":"nearest",
  "img":0
}


var checkedValue;
function openTab(evt,choice) {
 if(checkedValue){
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(choice).style.display = "block";
    evt.currentTarget.className += " active";
  }
  else{
    alert("select image first");
  }
}
function load(argument) {
  
  var scale = document.getElementById("scale");
  var scale_output = document.getElementById("scale_value");
  scale_output.innerHTML = scale.value;
  scale.oninput = function() {
    scale_output.innerHTML = this.value;
    input.scaling.s_value=this.value;
  }

  var angle_slider = document.getElementById("angle");
  var angle_output = document.getElementById("angle_value");
  angle_output.innerHTML = angle_slider.value;
  angle_slider.oninput = function() {
    angle_output.innerHTML = this.value;
    input.rotation=this.value;
  }

  var x_rotate_slider = document.getElementById("x_rotate");
  var x_rotate_output = document.getElementById("x_rotate_value");
  x_rotate_output.innerHTML = x_rotate_slider.value;
  x_rotate_slider.oninput = function() {
    x_rotate_output.innerHTML = this.value;
    input.translation.x_val=this.value;
   
  }

  var y_rotate_slider = document.getElementById("y_rotate");
  var y_rotate_output = document.getElementById("y_rotate_value");
  y_rotate_output.innerHTML = y_rotate_slider.value;

  y_rotate_slider.oninput = function() {
    y_rotate_output.innerHTML = this.value;
    input.translation.y_val=this.value;
  }



  // the selector will match all input controls of type :checkbox
  // and attach a click event handler 
  $("input:checkbox").on('click', function() {
    // in the handler, 'this' refers to the box clicked on
    var $box = $(this);
    if ($box.is(":checked")) {
      // the name of the box is retrieved using the .attr() method
      // as it is assumed and expected to be immutable
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      // the checked state of the group/box on the other hand will change
      // and the current value is retrieved using .prop() method
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } 
    else {
      $box.prop("checked", false);
    }
  });

}//load close
    
function getImageId(argument) {

  checkedValue = $('.radio:checked').val();
  input['img']='static/img/IMG'+checkedValue+'.png';
  if(checkedValue){
     $(document).ready(function(){
        $('#select_image').modal('hide');
        document.getElementById('input_image').src = "static/img/IMG"+checkedValue+".png";
        document.getElementById('output_image').src = "";

     });
  }
  else{
    alert("Select one image");
  }
}

function reset(argument) {
  var c=confirm("Will reset all values");
  if(c){
    location.reload(true);   
  }
}

$(document).ready(function(){

  $("input[name='input_radio']").click(function(){
    var radioValue = $("input[name='input_radio']:checked").val();  
    if (radioValue==1) {
      input['input']="scaling";
      $('input[name="Scaling"]').removeAttr('disabled');
      $(".wrap1").css('opacity', '1');
      $('input[name="Rotation"]').attr('disabled', 'disabled');
      $(".wrap2").css('opacity', '.2');
      $('input[name="Translation"]').attr('disabled', 'disabled');
      $(".wrap3").css('opacity', '.2');
    }
 
    else if (radioValue==2) {
      input['input']="rotation";
      $('input[name="Scaling"]').attr('disabled', 'disabled');
      $(".wrap1").css('opacity', '.2');
      $('input[name="Rotation"]').removeAttr('disabled');
      $(".wrap2").css('opacity', '1');
      $('input[name="Translation"]').attr('disabled', 'disabled');
      $(".wrap3").css('opacity', '.2');

    }
    else if(radioValue==3){
      input['input']="translation";
      $('input[name="Scaling"]').attr('disabled', 'disabled');
      $(".wrap1").css('opacity', '.2');
      $('input[name="Rotation"]').attr('disabled', 'disabled');
      $(".wrap2").css('opacity', '.2');
      $('input[name="Translation"]').removeAttr('disabled');
      $(".wrap3").css('opacity', '1');

    }

  });

  $("input[name='Scaling']").click(function(){
    input.scaling.scaling=$("input[name='Scaling']:checked").val();
    //alert(input.scaling.scaling);
    $('input[name="Scaling_value"]').removeAttr('disabled');
    var s=$("input[name='Scaling']:checked").val();    
    if(s=="down"){
      document.getElementById("scale").min=1;
      document.getElementById("scale").max=100;
      document.getElementById("scale").value=1;
      document.getElementById("scale_value").innerHTML=1;
      input.scaling.s_value=1;

    }
    else if (s=="up") {
      document.getElementById("scale").min=100;
      document.getElementById("scale").max=200;
      document.getElementById("scale").value=100;
      document.getElementById("scale_value").innerHTML=100;
      input.scaling.s_value=100;

    }
  });

  $("input[name='interpolation']").click(function(){
    var interpolation = $("input[name='interpolation']:checked").val();  
    //input.interpolation=interpolation;
  });


  $("#run").click(function(){
    if(checkedValue){
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(input),
        url: "/apply_filter", 
        success: function(data){
          $("#output_image").attr("src", "static/img/result.jpeg?random="+new Date().getTime());
        },
        error: function(){
          alert('failure because of not selecting values ');
        }
        /*dataType: "json"*/
      });
    }
    else{
      alert("select image first")
    }
  
  });

});
