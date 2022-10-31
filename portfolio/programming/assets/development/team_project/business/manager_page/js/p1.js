function setThumbnail1(event) {
    for (var image1 of event.target.files) {
        var reader = new FileReader();
        reader.onload = function(event) {
        var img = document.createElement("img");
        img.setAttribute("src", event.target.result);
        document.querySelector("div#image_container1").appendChild(img);
        };
        
        
        console.log(image1);
        reader.readAsDataURL(image1);
    };
};

function setThumbnail2(event) {
    for (var image2 of event.target.files) {
        var reader = new FileReader();
        reader.onload = function(event) {
        var img = document.createElement("img");
        img.setAttribute("src", event.target.result);
        document.querySelector("div#image_container2").appendChild(img);
        };
        
        
        console.log(image2);
        reader.readAsDataURL(image2);
    };
};