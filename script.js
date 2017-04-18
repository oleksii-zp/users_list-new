var arr;
// console.log(arr);

$(document).ready(function() {
    arr = getFromLocStor();
    console.log(arr);
      arr.forEach(function(item, i) {
        // console.log(arr[i]);
        insertTemplate(arr[i]);
      })

});

function getFromLocStor() {
    var returnObj = JSON.parse(localStorage.getItem("allUsers"));

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
                username: randomUser.login.username,
                email: randomUser.email,
                location: _.startCase(randomUser.location.state),
                zipcode: randomUser.location.postcode,
                city: _.startCase(randomUser.location.city),
                address: _.startCase(randomUser.location.street),
                phone: randomUser.phone,
                cell: randomUser.cell,
                registered: changeDate(randomUser.registered),
                lrgThumbnail: randomUser.picture.large
              }
              // console.log(newUser);
              arr.push(newUser);
              // console.log(arr);
              insertTemplate(newUser);
            });
        }
    });
}

function save() {
    var userObj = JSON.stringify(arr);
    localStorage.setItem("allUsers", userObj);
}

function insertTemplate(user) {
  var rowsTemplate = $("#rows-template").html();
  // console.log(rowsTemplate);
  // console.log(user);
  return $("#myTbody").append(_.template(rowsTemplate)(user));
}

function removeUser() {
    var button = event.target;
    var trToDelete = $(button).closest('.hiddenrow');
    var prevTrToDel = $(trToDelete[0]).prev('.firstrow');
    var userId = $(button).data('userId');
    arr.forEach(function(item, i) {
        if (arr[i].userId === userId) {
            arr.splice(i, 1);
        }
    })
    $(trToDelete[0]).remove();
    $(prevTrToDel[0]).remove();
};

var currentUserId;
function openEditForm() {
    var form = document.getElementById('userForm');
    form.reset();

    var button = event.target;
    currentUserId = $(button).data('userId');
    console.log(currentUserId);
    arr.forEach(function(item, i) {
        if (arr[i].userId === currentUserId) {
            $('#first').val(arr[i].first);
            $('#last').val(arr[i].last);
            if (arr[i].gender === 'female') {
                $(':radio[value=female]').prop('checked', true);
            } else {
                $(':radio[value=male]').prop('checked', true);
            }
            $('#birthday').prop('valueAsDate', new Date(arr[i].birthday));
            $('#username').val(arr[i].username);
            $('#email').val(arr[i].email);
            $('#location').val(arr[i].location);
            $('#zipcode').val(arr[i].zipcode);
            $('#city').val(arr[i].city);
            $('#address').val(arr[i].address);
            $('#phone').val(arr[i].phone);
            $('#cell').val(arr[i].cell);
            $('#registered').prop('valueAsDate', new Date(arr[i].registered));
            $('#thumbnailInForm').attr('src', arr[i].lrgThumbnail);
            $('#thumbnailInForm').off('click');
            $('#thumbnailInForm').click(function() {
              getRandomThumnail(arr[i].gender);
            })
        }

    });
  }

function editUser() {
  console.log(currentUserId);

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
        username: $('#username').val(),

        email: $('#email').val(),
        location: _.startCase($('#location').val()),
        zipcode: $('#zipcode').val(),
        city: _.startCase($('#city').val()),
        address: _.startCase($('#address').val()),
        phone: $('#phone').val(),
        cell: $('#cell').val(),
        registered: changeDate($('#registered').val()),
        lrgThumbnail: $('#thumbnailInForm').attr('src')
        }
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
    var options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    return someDate.toLocaleDateString('en-US', options);
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


function getRandomThumnail(gender) {
  console.log('a');
    $.ajax({
        url: 'https://randomuser.me/api/?nat=us&results=1&gender='+gender,
        dataType: 'json',
        success: function(data) {
          console.log(data);
              $('#thumbnailInForm').attr('src', data.results[0].picture.large);
              // return data.results[0].picture.large
              }
            });
        }
