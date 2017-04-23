$(document).ready(function(){
  $('#button-add-users').on('click', addUsers);
  $('#button-save').on('click', save);
  $('.search').on('keyup', searchBy);
  $('.sortable').on('click', sortTable);
  $('#button-remove-user').on('click', removeUser);
  $('#userForm').on('submit', editUser);



var arr;
// console.log(arr);


    arr = getFromLocStor();
    console.log(arr);
    arr.forEach(function(item, i) {
        console.log(arr[i]);
        insertTemplate(arr[i]);
    });


function getFromLocStor() {
    var returnObj = JSON.parse(localStorage.getItem("allUsers"));

    if (returnObj == null || returnObj.length === 0) {
        // var divAlert = document.createElement('div');
        // divAlert.className = 'alert alert-info text-center';
        // divAlert.innerHTML = '<strong>Sorry!</strong> No users found.';
        $("<div class = 'alert alert-info text-center'>Sorry! No users found.</div>").appendTo('#tableContainer');
        console.log();
        return [];
    } else {
        return returnObj;
    };
}

function insertTemplate(user, editTr, tr) {
    var compiled = _.template($("#rows-template").html())(user);
    var firstrow = $($(compiled)[0]).on('click', hideShow);
    var secondrow = $(compiled)[2];
    $(secondrow).find('.btn:first').on('click', openEditForm);
    $(secondrow).find('.btn:last').on('click', openConfirm);
    if (editTr) {$(tr).before(firstrow, secondrow);}
    else {$("#myTbody").append(firstrow).append(secondrow);}

}


function addUsers() {
    $.ajax({
        url: 'https://randomuser.me/api/?nat=us&results=1',
        dataType: 'json',
        success: function(data) {
            // console.log(data);
            $('.alert-info').remove();
            data.results.forEach(function(item, i) {
                var randomUser = data.results[i];
                var newUser = {
                    userId: randomUser.id.value,
                    first: _.startCase(randomUser.name.first),
                    last: _.startCase(randomUser.name.last),
                    gender: randomUser.gender,
                    get genderImg() {
                        if (this.gender === 'female') {
                            return './img/woman.png';
                        }
                        if (this.gender === 'male') {
                            return './img/man.png';
                        }
                    },
                    birthday: changeDate(randomUser.dob),
                    birthdayOrig: new Date(randomUser.dob),
                    username: randomUser.login.username,
                    email: randomUser.email,
                    location: _.startCase(randomUser.location.state),
                    zipcode: randomUser.location.postcode,
                    city: _.startCase(randomUser.location.city),
                    address: _.startCase(randomUser.location.street),
                    phone: randomUser.phone,
                    cell: randomUser.cell,
                    registered: changeDate(randomUser.registered),
                    registeredOrig: new Date(randomUser.registered),
                    lrgThumbnail: randomUser.picture.large
                }
                // console.log(newUser);
                arr.push(newUser);
                console.log(arr);
                insertTemplate(newUser);
            });
        }
    });
}

function save() {
    var userObj = JSON.stringify(arr);
    localStorage.setItem("allUsers", userObj);
}



var userIdToDel;
function openConfirm() {
    var button = event.target;
    userIdToDel = $(button).data('userId');
    arr.forEach(function(item, i) {
        if (arr[i].userId === userIdToDel) {
            $('#confirmMessage').text(arr[i].first + " " + arr[i].last).css('color', '#337ab7');
        }
    })

}

function removeUser() {
    var button = $("div").find("[data-user-id='" + userIdToDel + "']");
    var trToDelete = $(button).closest('.hiddenrow');
    var prevTrToDel = $(trToDelete[0]).prev('.firstrow');
    arr.forEach(function(item, i) {
        if (arr[i].userId === userIdToDel) {
            arr.splice(i, 1);
        }
    })
    $(trToDelete[0]).remove();
    $(prevTrToDel[0]).remove();
    $('#confirmDel').modal('hide');
};

var currentUserId;
function openEditForm() {
  var button = event.currentTarget;
  // console.log(button);
  currentUserId = $(button).data('userId');
  // console.log(currentUserId);
    var form = document.getElementById('userForm');
    form.reset();


    arr.forEach(function(item, i) {
        if (arr[i].userId === currentUserId) {
            $('#first').val(arr[i].first);
            $('#last').val(arr[i].last);
            if (arr[i].gender === 'female') {
                $(':radio[value=female]').prop('checked', true);
            } else {
                $(':radio[value=male]').prop('checked', true);
            }
            $('#birthday').prop('valueAsDate', new Date(arr[i].birthdayOrig));
            $('#username').val(arr[i].username);
            $('#email').val(arr[i].email);
            $('#location').val(arr[i].location);
            $('#zipcode').val(arr[i].zipcode);
            $('#city').val(arr[i].city);
            $('#address').val(arr[i].address);
            $('#phone').val(arr[i].phone);
            $('#cell').val(arr[i].cell);
            $('#registered').prop('valueAsDate', new Date(arr[i].registeredOrig));
            $('#thumbnailInForm').attr('src', arr[i].lrgThumbnail);
            $('#thumbnailInForm').off('click');
            $('#thumbnailInForm').click(function() {
                getRandomThumbnail($('input[name=gender]:checked').val());
            })
        }

    });
}

function editUser() {
    event.preventDefault();
    console.log(currentUserId);
    var button = $("div").find("[data-user-id='" + currentUserId + "']");
    var trToEdit = $(button).closest('.hiddenrow');
    var prevTrToEdit = $(trToEdit).prev('.firstrow');
    console.log(trToEdit);
    console.log(prevTrToEdit);
    arr.forEach(function(item, i) {
        if (arr[i].userId === currentUserId) {
            arr[i] = {
                userId: currentUserId,
                first: _.startCase($('#first').val()),
                last: _.startCase($('#last').val()),
                gender: $('input[name=gender]:checked').val(),
                get genderImg() {
                    if (this.gender === 'female') {
                        return './img/woman.png';
                    }
                    if (this.gender === 'male') {
                        return './img/man.png';
                    }
                },
                birthday: changeDate($('#birthday').val()),
                birthdayOrig: $('#birthday').prop('valueAsDate'),
                username: $('#username').val(),
                email: $('#email').val(),
                location: _.startCase($('#location').val()),
                zipcode: $('#zipcode').val(),
                city: _.startCase($('#city').val()),
                address: _.startCase($('#address').val()),
                phone: $('#phone').val(),
                cell: $('#cell').val(),
                registered: changeDate($('#registered').val()),
                registeredOrig: $('#registered').prop('valueAsDate'),
                lrgThumbnail: $('#thumbnailInForm').attr('src')
            };
            insertTemplate(arr[i], true, prevTrToEdit);
            $(trToEdit[0]).remove();
            $(prevTrToEdit[0]).remove();
            $('#myModal').modal('hide');
        }

    })
    console.log(arr);
}

// function countFemale() {
//     var numFemale = 0;
//     arr.forEach(function(item, i) {
//         if (arr[i].gender === 'female') {
//             numFemale += 1;
//         };
//     })
//     return numFemale;
// };
//
// function countMale() {
//     var numMale = 0;
//     arr.forEach(function(item, i) {
//         if (arr[i].gender === 'male') {
//             numMale += 1;
//         };
//     })
//     return numMale;
// };

function changeDate(myDate) {
    var someDate = new Date(myDate);
    // var options = {
    //     year: 'numeric',
    //     month:'2-digit',
    //     day: '2-digit'
    // };
    return someDate.toLocaleDateString();
};

function searchBy() {
    $('.divInfo').css('display', 'none');
    $('.plMin').css('backgroundImage', 'url(./img/plus.png)');
    var input,
        tdIndex,
        filt,
        tr,
        dataAttr,
        counter,
        td,
        i;
    input = event.target;
    tdIndex = $(input).parent().prop('cellIndex');
    filt = input.value.toUpperCase();
    tr = $('tr.firstrow');
    for (i = 0; i < tr.length; i++) {
        dataAttr = $(tr[i]).prop('dataset');
        counter = Object.keys(dataAttr).length;
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

function sortTable() {
    var table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
        var thclick = event.currentTarget;
        console.log(thclick);
        var n = thclick.cellIndex;
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
    // var thsort = $('.sortable');
    $('.sortable').css('backgroundImage', 'url(./img/sort.png)')
    if (dir == 'asc') {
        $(thclick).css('backgroundImage', 'url(./img/sortasc.png)')
    }
    if (dir == 'desc') {
        $(thclick).css('backgroundImage', 'url(./img/sortdesc.png)')
    }
}

function getRandomThumbnail(gender) {
    console.log('a');
    $.ajax({
        url: 'https://randomuser.me/api/?nat=us&results=1&gender=' + gender,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            $('#thumbnailInForm').attr('src', data.results[0].picture.large);
            // return data.results[0].picture.large
        }
    });
}

})
