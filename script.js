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
            console.log(arr);
        }
        // var table = document.getElementById("myTable");
        // var tbody = document.getElementById('myTbody');

        // var row = tbody.insertRow(-1);
        // row.className = 'firstrow';

        // row.insertCell(0);
        // row.insertCell(1);
        // row.insertCell(2);
        // row.insertCell(3);
        // row.insertCell(4);
        // row.insertCell(5);
        // row.insertCell(6);

        // var image = document.createElement('img');
        // image.className = 'avatar';
        // image.src = path[i].picture.thumbnail;
        // row.cells[0].appendChild(image);
        // row.cells[1].innerHTML = capitalizeFirstLetter(path[i].name.last);
        // row.cells[2].innerHTML = capitalizeFirstLetter(path[i].name.first);
        // row.cells[3].innerHTML = path[i].login.username;
        // row.cells[4].innerHTML = path[i].phone;
        // row.cells[5].innerHTML = capitalizeFirstLetter(path[i].location.state);
        // var plusMinusImg = document.createElement('div');
        // plusMinusImg.className = 'plMin';
        // plusMinusImg.style.backgroundImage = 'url(./img/plus.png)';
        // row.cells[6].appendChild(plusMinusImg);

        $('#myTbody').append($('<tr>').addClass('firstrow').attr('onclick', 'hideShow()').append($('<td><td><td><td><td><td><td>')));
        fillRow('.firstrow:last', path, i);


// $('#myTbody').append($('<tr>').addClass('hiddenrow').append($('<td>').attr('colspan', 7)));
//
// $('.hiddenrow:last').find('td').eq(0).append($('<div>').addClass('divInfo')
//   .append($('<div>').addClass('headinfo'))
//   .append($('<div>').addClass('infoBlocks'))
// );


        var tbody = document.getElementById('myTbody');
        var row2 = tbody.insertRow(-1);
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
        buttonEdit.setAttribute('onclick', 'openEditForm()');
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
        bigImage.className = 'mythumbnail';
        bigImage.src = path[i].picture.large;
        divFourthBlock.appendChild(bigImage);

    });
}


function fillRow(rowToFill, path, i) {
  $(rowToFill).find('td')
    .eq(0).append($('<img>').addClass('mythumbnail').attr('src', path[i].picture.thumbnail)).end()
    .eq(1).append(capitalizeFirstLetter(path[i].name.last)).end()
    .eq(2).append(capitalizeFirstLetter(path[i].name.first)).end()
    .eq(3).append(path[i].login.username).end()
    .eq(4).append(path[i].phone).end()
    .eq(5).append(capitalizeFirstLetter(path[i].location.state)).end()
    .eq(6).addClass('plMin').css('backgroundImage', 'url(./img/plus.png)');
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

var userId;
function openEditForm() {
    var form = document.getElementById('userForm');
    form.reset();
    var button = event.srcElement;
    userId = $(button).data('userId');
    var objectToEdit = arr.forEach(function(item, i) {
        if (arr[i].id.value === userId) {
            $('#first').val(capitalizeFirstLetter(arr[i].name.first));
            $('#last').val(capitalizeFirstLetter(arr[i].name.last));
            if (arr[i].gender === 'female') {
                $(':radio[value=female]').prop('checked', true);
            } else {
                $(':radio[value=male]').prop('checked', true);
            }
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

function editUser() {
  console.log(userId);
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

function searchBy() {
    $('.divInfo').css('display', 'none');
    $('.plMin').css('backgroundImage', 'url(./img/plus.png)');
    var input,
        tdIndex,
        filt,
        tr,
        td,
        i;
    input = event.srcElement;
    tdIndex = $(input).parent().prop('cellIndex');
    filt = input.value.toUpperCase();
    tr = $('tr.firstrow');
    for (i = 0; i < tr.length; i++) {
        var dataAttr = $(tr[i]).prop('dataset');
        var counter = 0;
        for (var key in dataAttr) {
            counter++;
        }
        td = tr[i].getElementsByTagName("td")[tdIndex];
        if (td.innerHTML.toUpperCase().indexOf(filt) > -1) {
            if (dataAttr[tdIndex] && counter === 1) {
                tr[i].style.display = "";
                $(tr[i]).removeAttr('data-' + tdIndex);
            }
            if (dataAttr[tdIndex] && counter > 1) {
                tr[i].style.display = "none";
                $(tr[i]).removeAttr('data-' + tdIndex);
            }

        } else {
            tr[i].style.display = "none";
            $(tr[i]).attr('data-' + tdIndex, '1');
        }
    };
};

function hideShow() {
  var tr = event.currentTarget;
  var plMin = $(tr).find('.plMin');
  var divToHide = $(tr).next().find('.divInfo');
    if (divToHide[0].style.display == 'none') {
        $('.divInfo').slideUp();
        $('.plMin').css('backgroundImage', 'url(./img/plus.png)');
        $(divToHide[0]).slideDown();
        $(plMin[0]).css('backgroundImage', 'url(./img/minus.png)');
    } else {
        $(divToHide[0]).slideUp();
        $(plMin[0]).css('backgroundImage', 'url(./img/plus.png)');
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

// $('#myTbody').append('<tr class="firstrow" onclick="hideShow()"><td><img class="mythumbnail" src=""></td><td></td><td></td><td></td><td></td><td></td><td class="plMin" style="background-image: url(&quot;./img/plus.png&quot;);"></td></tr>');
// $('#myTbody').append('<tr class="hiddenrow"><td colspan="7"><div class="divInfo" style="display: none;"><div class="headinfo"><div class="nameandgender"><span class="bigName"></span><img src="" class="gender"></div><div class="btn-group"><div class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal" data-user-id="" onclick="openEditForm()">Edit <span class="glyphicon glyphicon-pencil"></span></div><div class="btn btn-danger btn-sm" onclick="removeUser()" data-user-id="">Remove <span class="glyphicon glyphicon-trash"></span></div></div></div><div class="infoBlocks"><div class="infoBlock"><p><span>Username </span><span class="notBold"></span></p><p><span>Registered </span><span class="notBold"></span></p><p><span>Email </span><span class="notBold"></span></p></div><div class="infoBlock"><p><span>Address </span><span class="notBold"></span></p><p><span>City </span><span class="notBold"></span></p><p><span>Zip Code </span><span class="notBold"></span></p></div><div class="infoBlock"><p><span>Birthday </span><span class="notBold"></span></p><p><span>Phone </span><span class="notBold"></span></p><p><span>Cell </span><span class="notBold"></span></p></div><div class="infoBlock"><img class="mythumbnail" src=""></div></div></div></td></tr>');
