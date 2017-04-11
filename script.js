var arr;

$(document).ready(function() {
    arr = getFromLocStor();
    innerResult(arr);

});

function getFromLocStor() {
    var returnObj = JSON.parse(localStorage.getItem("user"));

    if (returnObj == null || returnObj.length === 0) {
        var divAlert = document.createElement('div');
        divAlert.className = 'alert alert-info text-center';
        divAlert.innerHTML = '<strong>Sorry!</strong> No users found.';
        $('#tableContainer').append(divAlert);
        return returnObj = [];
    } else {
        return returnObj
    }
}

function addUsers() {
    $.ajax({
        url: 'https://randomuser.me/api/?nat=us&results=1',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            $('.alert-info').remove();
            innerResult(data.results, true);
        }
    });
}

function save() {
    var userObj = JSON.stringify(arr);
    localStorage.setItem("user", userObj);
}



function innerResult(path, addToArr) {
    path.forEach(function(item, i) {
        if (addToArr) {
            arr.push(path[i]);
            // console.log(arr);
        }
        var table = document.getElementById("myTable");
        var row = table.insertRow(-1);
        row.className = 'firstrow';

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);

        var image = document.createElement('img');
        image.className = 'avatar';
        image.src = path[i].picture.thumbnail;
        cell1.appendChild(image);
        cell2.innerHTML = capitalizeFirstLetter(path[i].name.last);
        cell3.innerHTML = capitalizeFirstLetter(path[i].name.first);
        cell4.innerHTML = path[i].login.username;
        cell5.innerHTML = path[i].phone;
        cell6.innerHTML = capitalizeFirstLetter(path[i].location.state);
        var plusMinusImg = document.createElement('div');
        plusMinusImg.className = 'plMin';
        plusMinusImg.style.backgroundImage = 'url(./img/plus.png)';
        cell7.appendChild(plusMinusImg);

        var row2 = table.insertRow(-1);
        row2.className = 'hiddenrow';

        var cell1n = row2.insertCell(0);
        cell1n.colSpan = '7';
        var divInfo = document.createElement('div');
        divInfo.className = 'divInfo';
        divInfo.style.display = 'none';
        cell1n.appendChild(divInfo);

        

        var divHeadInfo = document.createElement('div');
        divHeadInfo.className = 'headinfo';
        divInfo.appendChild(divHeadInfo);
        var divNameAndGender = document.createElement('div');
        divNameAndGender.className = 'nameandgender';
        divHeadInfo.appendChild(divNameAndGender);
        var spanName = document.createElement('span');
        spanName.className = "bigName";
        var genderImg = document.createElement('img');
        genderImg.src = (function() {
            if (path[i].gender == 'female') {
                return './img/woman.png';
            } else {
                return './img/man.png'
            }
        })();
        genderImg.className = 'gender';
        spanName.innerHTML = capitalizeFirstLetter(path[i].name.first);
        divNameAndGender.appendChild(spanName);
        divNameAndGender.appendChild(genderImg);

        var divButtonGroup = document.createElement('div');
        divButtonGroup.className = 'btn-group';
        divHeadInfo.appendChild(divButtonGroup);
        var buttonEdit = document.createElement('div');
        buttonEdit.type = 'button';
        buttonEdit.className = 'btn btn-primary btn-sm';
        buttonEdit.setAttribute('data-toggle', 'modal');
        buttonEdit.setAttribute('data-target', '#myModal');
        buttonEdit.setAttribute('data-user-id', path[i].id.value);
        buttonEdit.setAttribute('onclick', 'editUser()');
        buttonEdit.innerHTML = 'Edit <span class="glyphicon glyphicon-pencil"></span>';
        divButtonGroup.appendChild(buttonEdit);

        var buttonRemove = document.createElement('div');
        buttonRemove.type = 'button';
        buttonRemove.className = 'btn btn-danger btn-sm';
        buttonRemove.setAttribute('onclick', 'removeUser()');
        buttonRemove.setAttribute('data-user-id', path[i].id.value);
        buttonRemove.innerHTML = 'Remove <span class="glyphicon glyphicon-trash"></span>';
        divButtonGroup.appendChild(buttonRemove);

        var divBlocks = document.createElement('div');
        divBlocks.className = 'infoBlocks';
        divInfo.appendChild(divBlocks);

        var divFirstBlock = document.createElement('div');
        divFirstBlock.className = 'infoBlock';
        divBlocks.appendChild(divFirstBlock);

        fillBlock('Username', divFirstBlock, path[i].login.username);
        fillBlock('Registered', divFirstBlock, path[i].registered);
        fillBlock('Email', divFirstBlock, path[i].email);

        var divSecondBlock = document.createElement('div');
        divSecondBlock.className = 'infoBlock';
        divBlocks.appendChild(divSecondBlock);

        fillBlock('Address', divSecondBlock, path[i].location.street);
        fillBlock('City', divSecondBlock, path[i].location.city);
        fillBlock('Zip Code', divSecondBlock, path[i].location.postcode);

        var divThirdBlock = document.createElement('div');
        divThirdBlock.className = 'infoBlock';
        divBlocks.appendChild(divThirdBlock);

        fillBlock('Birthday', divThirdBlock, path[i].dob);
        fillBlock('Phone', divThirdBlock, path[i].phone);
        fillBlock('Cell', divThirdBlock, path[i].cell);

        var divFourthBlock = document.createElement('div');
        divFourthBlock.className = 'infoBlock';
        divBlocks.appendChild(divFourthBlock);
        var bigImage = document.createElement('img');
        bigImage.className = 'avatar';
        bigImage.src = path[i].picture.large;
        divFourthBlock.appendChild(bigImage);

        row.onclick = function() {
            hideShow(divInfo, plusMinusImg);
        };
    });
}

function removeUser() {
    var button = event.srcElement;
    var trToDelete = $(button).closest('.hiddenrow');
    var prevTrToDel = $(trToDelete[0]).prev('.firstrow');
    var userId = $(button).data('userId');
    var objectToDel = arr.forEach(function(item, i) {
        if (arr[i].id.value === userId) {
            arr.splice(i, 1);
        }
    })
    $(trToDelete[0]).remove();
    $(prevTrToDel[0]).remove();
};

function editUser() {
  var form = document.getElementById('userForm');
  form.reset();
  var button = event.srcElement;
  var userId = $(button).data('userId');
  var objectToEdit = arr.forEach(function(item, i) {
      if (arr[i].id.value === userId) {
        $('#first').val(capitalizeFirstLetter(arr[i].name.first));
        $('#last').val(capitalizeFirstLetter(arr[i].name.last));
        if (arr[i].gender === 'female') {
          $(':radio[value=female]').prop('checked', true);
        }
        else {$(':radio[value=male]').prop('checked', true);}
        // var someDate = new Date(arr[i].dob);
        $('#birthday').prop('valueAsDate', new Date(arr[i].dob));
        $('#username').val(arr[i].login.username);
        $('#email').val(arr[i].email);
        $('#location').val(capitalizeFirstLetter(arr[i].location.state));
        $('#zipcode').val(arr[i].location.postcode);
        $('#city').val(capitalizeFirstLetter(arr[i].location.city));
        $('#address').val(capitalizeFirstLetter(arr[i].location.street));
        $('#phone').val(arr[i].phone);
        $('#cell').val(arr[i].cell);
        $('#registered').prop('valueAsDate', new Date(arr[i].registered));


      }

});
}

function countFemale() {
    var numFemale = 0;
    arr.forEach(function(item, i) {
        if (arr[i].gender === 'female') {
            numFemale += 1;
        };
    })
    return numFemale;
};

function countMale() {
    var numMale = 0;
    arr.forEach(function(item, i) {
        if (arr[i].gender === 'male') {
            numMale += 1;
        };
    })
    return numMale;
};

function capitalizeFirstLetter(someWord) {
    return someWord.charAt(0).toUpperCase() + someWord.slice(1);
};

function changeDate(myDate) {
    var someDate = new Date(myDate);
    var options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    return someDate.toLocaleDateString('en-US', options);
};

function fillBlock(dataName, blockToFill, dataPath) {
    var createP = document.createElement('p');
    blockToFill.appendChild(createP);
    var titleName = document.createElement('span');
    titleName.innerHTML = dataName + ' ';
    var datasName = document.createElement('span');
    datasName.className = 'notBold';
    if (dataName == 'City') {
        datasName.innerHTML = capitalizeFirstLetter(dataPath);
    } else if (dataName == 'Registered' || dataName == 'Birthday') {
        datasName.innerHTML = changeDate(dataPath);
    } else {
        datasName.innerHTML = dataPath;
    }
    createP.appendChild(titleName);
    createP.appendChild(datasName);
};

function searchBy(inputname, tdnum) {
    $('.divInfo').css('display', 'none');
    $('.plMin').css('backgroundImage', 'url(./img/plus.png)');

    var input,
        filt,
        table,
        tr,
        td,
        i;
    input = $('input.search[name=' + inputname + ']');
    filt = input[0].value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByClassName("firstrow");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[tdnum];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filt) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
};

function hideShow(div, img) {
    if (div.style.display == 'none') {
        $('.divInfo').slideUp();
        $('.plMin').css('backgroundImage', 'url(./img/plus.png)');
        $(div).slideDown();
        $(img).css('backgroundImage', 'url(./img/minus.png)');
    } else {
        $(div).slideUp();
        $(img).css('backgroundImage', 'url(./img/plus.png)');
    };
}

function sortTable(n) {
    var table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.getElementsByClassName("firstrow");
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            var b = $(rows[i + 1]).next('.hiddenrow');
            var a = rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            $(a).after(b);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    var thsort = $('.sortable');
    $(thsort).css('backgroundImage', 'url(./img/sort.png)')
    if (dir == 'asc') {
        $(thsort[n - 1]).css('backgroundImage', 'url(./img/sortasc.png)')
    }
    if (dir == 'desc') {
        $(thsort[n - 1]).css('backgroundImage', 'url(./img/sortdesc.png)')
    }
}
