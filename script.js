$(document).ready(function () {
    $('#button-add-newuser').on('click', function () {
        openFormModal('add')
    });
    $('#button-random-user').on('click', getRandomUser);
    $('#button-save').on('click', save);
    $('#notification').on('click', showBirthdayReminder);
    $('#button-remove-users').on('click', removeUsers);
    $('.search').on('keyup', searchBy);
    $('#button-clear-filter').on('click', clearFilter);
    $('.sortable').on('click', sortTable);
    $('#button-remove-user').on('click', removeUser);
    $('#userForm').on('submit', addEditUser);
    $('#button-cancel-remove').on('click', cancelRemove);
    $('#button-remove-checked').on('click', function () {
        openConfirm('checked')
    });
    $('#thumbnailInForm').on('click', (function () {
        getRandomThumbnail($('input[name=gender]:checked').val());
    })).on('contextmenu', resetRandomThumbnail);

    var arr;
    arr = getFromLocStor();
    console.log(arr);
    arr.forEach(function (item, i) {
        insertTemplate(arr[i]);
    });

    function getFromLocStor() {
        lastUserId = +localStorage.getItem("lastId");
        var returnObj = JSON.parse(localStorage.getItem("allUsers"));
        if (returnObj == null || returnObj.length === 0) {
            $('#no-users').css('display', 'block');
            return [];
        } else {
            return returnObj;
        };
    }

    function save() {
        var userObj = JSON.stringify(arr);
        localStorage.setItem("allUsers", userObj);
        localStorage.setItem("lastId", lastUserId);
    }

    function insertTemplate(user, editTr, tr) {
        var userToInsert = Object.assign({}, user);
        userToInsert.birthday = changeDate(userToInsert.birthday);
        userToInsert.registered = changeDate(userToInsert.registered);
        var compiled = _.template($("#rows-template").html())(userToInsert);
        var firstrow = $($(compiled)[0]).on('click', hideShow);
        var secondrow = $(compiled)[2];
        $(secondrow).find('.btn:first').on('click', openEditForm);
        $(secondrow).find('.btn:last').on('click', function () {
            openConfirm('current');
        });
        if (editTr) {
            $(tr).before(firstrow, secondrow);
        } else {
            $("#myTbody").append(firstrow).append(secondrow);
        }
    }

    var lastUserId;

    function addEditUser(e) {
        if (e.isDefaultPrevented()) {
        console.log('Alarm');
  } else {
  event.preventDefault();
        var formTarget = $('#formModal').prop('dataset');
        if (formTarget.formTarget === 'edit') {
            var button = $("div").find("[data-user-id=" + currentUserId + "]");
            var trToEdit = $(button).closest('.hiddenrow');
            var prevTrToEdit = $(trToEdit).prev('.firstrow');
            var userToEdit = _.find(arr, {
                'userId': currentUserId
            });
            createEditObject(userToEdit);
            insertTemplate(userToEdit, true, prevTrToEdit);
            $(trToEdit[0]).remove();
            $(prevTrToEdit[0]).remove();
        }
        if (formTarget.formTarget === 'add') {
            lastUserId += 1;
            currentUserId = lastUserId;
            var newUser = {};
            createEditObject(newUser);
            arr.push(newUser);
            insertTemplate(newUser);
        }
        $('#formModal').modal('hide');
        $('#no-users').css('display', 'none');
    }
    }

    var usersToDel;

    function openConfirm(target) {
        usersToDel = [];
        if (target === 'current') {
            var button = event.currentTarget;
            var userIdToDel = $(button).data('userId');
            userToDel = _.find(arr, {
                'userId': userIdToDel
            });
            usersToDel.push(userToDel);
            $('#confirmDel').find('.text-center').html('Are you sure you want to delete <span id = "confirmMessage"></span>?');
            $('#confirmMessage').text(usersToDel[0].first + " " + usersToDel[0].last).css('color', '#337ab7');
        }
        if (target === 'checked') {
            var checkedUsers = $('input:checked').closest('.firstrow').next('.hiddenrow').find('.btn:last');
            $(checkedUsers).each(function () {
                userToDel = _.find(arr, {
                    'userId': $(this).data('userId')
                });
                usersToDel.push(userToDel);
            });
            if (checkedUsers.length === 0) {
                $('#confirmDel').find('.text-center').text('No users checked!')
            } else {
                $('#confirmDel').find('.text-center').html('Are you sure you want to delete <span id = "confirmMessage"></span>?');
                $('#confirmMessage').text(checkedUsers.length + ' user(s)').css('color', '#337ab7');
            }
        }
    }

    function removeUsers() {
        var removeStatus = $('#button-remove-checked').prop('dataset');
        if (removeStatus.removeUsers !== 'open') {
            $('#button-remove-checked').css('display', 'block').attr('data-remove-users', 'open');
            $('#button-cancel-remove').css('display', 'block');
            $('.firstrow, #filter').prepend($('<td class="remove-users">').css('width', '20px'));
            $('.hiddenrow').prepend($('<td class="temporary">').css('width', '20px'));
            $('.remove-users').append('<input type="checkbox" name="checkRemove">');
            $("input[type='checkbox']").click(function (event) {
                event.stopPropagation();
            });
            $("input[type='checkbox']").first().change(function () {
                $("input[type='checkbox']").prop('checked', $(this).prop('checked'));
            });
        }
    }

    function removeUser() {
        usersToDel.forEach(function (item, i) {
            var button = $("div").find("[data-user-id='" + usersToDel[i].userId + "']");
            var trToDelete = $(button).closest('.hiddenrow');
            var prevTrToDel = $(trToDelete[0]).prev('.firstrow');
            arr.splice(arr.indexOf(usersToDel[i]), 1);
            $(trToDelete[0]).remove();
            $(prevTrToDel[0]).remove();
        });
        cancelRemove();
        $('#confirmDel').modal('hide');
        if (arr.length === 0) {
            $('#no-users').css('display', 'block');
        }
    };

    function cancelRemove() {
        $('#button-remove-checked').css('display', 'none').removeAttr('data-remove-users');
        $('#button-cancel-remove').css('display', 'none');
        $('.remove-users, .temporary').remove();
    }

    var currentUserId;
    function openEditForm() {
        openFormModal('edit');
        var button = event.currentTarget;
        currentUserId = $(button).data('userId');
        var objectToEdit = _.find(arr, {
            'userId': currentUserId
        });
        fillForm(objectToEdit);
    }

    function openFormModal(target) {
        cancelRemove();
        $('#formModal').removeAttr('data-form-target', '');
        $('#userForm')[0].reset();
        $('#thumbnailInForm').attr('src', '');
        $('#formModal').modal('show');
        if (target === 'add') {
            $('#modal-title').text('Add new user');
            $('#formModal').attr('data-form-target', target)
        };
        if (target === 'edit') {
            $('#modal-title').text('Edit user');
            $('#formModal').attr('data-form-target', target)
        };
    }

    function getRandomUser() {
        $.ajax({
            url: 'https://randomuser.me/api/?nat=us&results=1',
            dataType: 'json',
            success: function (data) {
                var newUser = {
                    first: _.startCase(data.results[0].name.first),
                    last: _.startCase(data.results[0].name.last),
                    gender: data.results[0].gender,
                    genderImg: getGenderImg(data.results[0].gender),
                    birthday: new Date(data.results[0].dob),
                    username: data.results[0].login.username,
                    email: data.results[0].email,
                    location: _.startCase(data.results[0].location.state),
                    zipcode: data.results[0].location.postcode,
                    city: _.startCase(data.results[0].location.city),
                    address: _.startCase(data.results[0].location.street),
                    phone: data.results[0].phone,
                    cell: data.results[0].cell,
                    registered: new Date(data.results[0].registered),
                    lrgThumbnail: data.results[0].picture.large
                }
                fillForm(newUser);
             $('#userForm').validator('validate');
            }
        });
    };


    function fillForm(user) {
        $('#first').val(user.first);
        $('#last').val(user.last);
        if (user.gender === 'female') {
            $(':radio[value=female]').prop('checked', true);
        } else {
            $(':radio[value=male]').prop('checked', true);
        }
        $('#birthday').prop('valueAsDate', new Date(user.birthday));
        $('#username').val(user.username);
        $('#email').val(user.email);
        $('#location').val(user.location);
        $('#zipcode').val(user.zipcode);
        $('#city').val(user.city);
        $('#address').val(user.address);
        $('#phone').val(user.phone);
        $('#cell').val(user.cell);
        $('#registered').prop('valueAsDate', new Date(user.registered));
        $('#thumbnailInForm').attr('src', user.lrgThumbnail);
        
    }

    function createEditObject(user) {
        user.first = _.startCase($('#first').val());
        user.last = _.startCase($('#last').val());
        user.gender = $('input[name=gender]:checked').val();
        user.genderImg = getGenderImg(user.gender);
        user.birthday = $('#birthday').prop('valueAsDate');
        user.username = $('#username').val();
        user.email = $('#email').val();
        user.location = _.startCase($('#location').val());
        user.zipcode = $('#zipcode').val();
        user.city = _.startCase($('#city').val());
        user.address = _.startCase($('#address').val());
        user.phone = $('#phone').val();
        user.cell = $('#cell').val();
        user.registered = $('#registered').prop('valueAsDate');
        user.lrgThumbnail = $('#thumbnailInForm').attr('src');
        user.userId = currentUserId;
    }

    function getGenderImg(gender) {
        if (gender === 'female') {
            return './img/woman.png';
        }
        if (gender === 'male') {
            return './img/man.png';
        }
    };

    function changeDate(myDate) {
        var someDate = new Date(myDate);
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
                    $(tr[i]).css('display', '').removeAttr('data-' + tdIndex);
                }
                if (dataAttr[tdIndex] && counter > 1) {
                    $(tr[i]).css('display', 'none').removeAttr('data-' + tdIndex);
                }
            } else {
                $(tr[i]).css('display', 'none').attr('data-' + tdIndex, '1');
            }
        };
    };

    function clearFilter() {
        $('.search').val('');
        $('.firstrow').css('display', '').each(function () {
            for (j = 1; j <= 5; j++) {
                $(this).removeAttr('data-' + j);
            };
        });
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
        };
        $('.sortable').css('backgroundImage', 'url(./img/sort.png)')
        if (dir == 'asc') {
            $(thclick).css('backgroundImage', 'url(./img/sortasc.png)')
        };
        if (dir == 'desc') {
            $(thclick).css('backgroundImage', 'url(./img/sortdesc.png)')
        };
    }

    function getRandomThumbnail(gender) {
        $.ajax({
            url: 'https://randomuser.me/api/?nat=us&results=1&gender=' + gender,
            dataType: 'json',
            success: function (data) {
                $('#thumbnailInForm').attr('src', data.results[0].picture.large);
            }
        });
    };

    function resetRandomThumbnail() {
        var formTarget = $('#formModal').prop('dataset');
        if (formTarget.formTarget === 'edit') {
            var userToEdit = _.find(arr, {
                'userId': currentUserId
            });
            $('#thumbnailInForm').attr('src', userToEdit.lrgThumbnail);
        };
        if (formTarget.formTarget === 'add') {
            $('#thumbnailInForm').removeAttr('src');
        }
        return false;
    };

    function showBirthdayReminder() {
        var birthdays = [];
        var currentDate = new Date().setHours(3, 0, 0, 0);
        console.log(currentDate);

        function setMyYear(dateToChange) {
            var a = new Date(dateToChange).setFullYear(new Date().getFullYear());
            if (a < currentDate) {
                a = new Date(dateToChange).setFullYear(new Date().getFullYear() + 1);
            }
            return a;
        };
        arr.forEach(function (item, i) {
            var tempUser = {
                birthday: setMyYear(arr[i].birthday),
                userId: arr[i].userId,
                gender: arr[i].gender,
                fullName: arr[i].first + " " + arr[i].last
            };
            if (tempUser.birthday < currentDate + 31 * 24 * 60 * 60 * 1000) {
                birthdays.push(tempUser);
            }
        });

        if (birthdays.length > 0) {
            (function () {
                var minBirthday = _.minBy(birthdays, 'birthday');
                console.log(birthdays);

                function whenBirthday() {
                    if (minBirthday.birthday === currentDate) {
                        return 'Today';
                    }
                    if (minBirthday.birthday === currentDate + 24 * 60 * 60 * 1000) {
                        return 'Tomorrow';
                    }
                    if (minBirthday.birthday >= currentDate + 24 * 60 * 60 * 1000) {
                        return 'In ' + (minBirthday.birthday - currentDate) / 1000 / 60 / 60 / 24 + ' days';
                    }
                }
                var birthdaysToDisplay = _.filter(birthdays, ['birthday', minBirthday.birthday]);

                function namesToDispalay() {
                    var namesArr = [];
                    birthdaysToDisplay.forEach(function (item, i) {
                        namesArr.push(birthdaysToDisplay[i].fullName);
                    })
                    return namesArr.join('<br>');
                }

                function himHerThem() {
                    if (birthdaysToDisplay.length > 1) {
                        return 'them';
                    } else if (birthdaysToDisplay[0].gender === 'male') {
                        return 'him'
                    } else {
                        return 'her'
                    }
                }
                $('#birthday-notification').html(whenBirthday() + ' is the birthday of ' + '<br>' + '<span>' + namesToDispalay() + '</span>' + '<br>' + 'Don\'t forget to congratulate ' + himHerThem() + ' on ' + '<span>' + changeDate(minBirthday.birthday) + '</span>' + '!')
            })();
        } else {
            $('#birthday-notification').text('No events are expected in the coming month.')
        }
        $('#birthday-reminder').modal('show');
    }

function formValidate (){
       $('#userForm').validator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            first_name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please supply your first name'
                    }
                }
            },
             last_name: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply your last name'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your phone number'
                    },
                    phone: {
                        country: 'US',
                        message: 'Please supply a vaild phone number with area code'
                    }
                }
            },
            address: {
                validators: {
                     stringLength: {
                        min: 8,
                    },
                    notEmpty: {
                        message: 'Please supply your street address'
                    }
                }
            },
            city: {
                validators: {
                     stringLength: {
                        min: 4,
                    },
                    notEmpty: {
                        message: 'Please supply your city'
                    }
                }
            },
            state: {
                validators: {
                    notEmpty: {
                        message: 'Please select your state'
                    }
                }
            },
            zip: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your zip code'
                    },
                    zipCode: {
                        country: 'US',
                        message: 'Please supply a vaild zip code'
                    }
                }
            },
            comment: {
                validators: {
                      stringLength: {
                        min: 10,
                        max: 200,
                        message:'Please enter at least 10 characters and no more than 200'
                    },
                    notEmpty: {
                        message: 'Please supply a description of your project'
                    }
                    }
                }
            }
        })
}




});