/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
var app = {};

// Config
app.config = {
    'sessionToken': false
};

// AJAX Client (for RESTful API)
app.client = {}

// Interface for making API calls
app.client.request = function (headers, path, method, queryStringObject, payload, callback) {

    // Set defaults
    headers = typeof (headers) == 'object' && headers !== null ? headers : {};
    path = typeof (path) == 'string' ? path : '/';
    method = typeof (method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof (queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof (payload) == 'object' && payload !== null ? payload : {};
    callback = typeof (callback) == 'function' ? callback : false;

    // For each query string parameter sent, add it to the path
    var requestUrl = path + '?';
    var counter = 0;
    for (var queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++;
            // If at least one query string parameter has already been added, preprend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&';
            }
            // Add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }
    }

    // Form the http request as a JSON type
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Content-type", "application/json");

    // For each header sent, add it to the request
    for (var headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    // If there is a current session token set, add that as a header
    if (app.config.sessionToken) {
        xhr.setRequestHeader("token", app.config.sessionToken.id);
    }

    // When the request comes back, handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var statusCode = xhr.status;
            var responseReturned = xhr.responseText;

            // Callback if requested
            if (callback) {
                try {
                    var parsedResponse = JSON.parse(responseReturned);
                    callback(statusCode, parsedResponse);
                } catch (e) {
                    callback(statusCode, false);
                }

            }
        }
    }

    // Send the payload as JSON
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);

};

// Bind the logout button
app.bindLogoutButton = function () {
    document.getElementById("logoutButton").addEventListener("click", function (e) {

        // Stop it from redirecting anywhere
        e.preventDefault();

        // Log the user out
        app.logUserOut();

    });
};

// Log the user out then redirect them
app.logUserOut = function (redirectUser) {
    // Set redirectUser to default to true
    redirectUser = typeof (redirectUser) == 'boolean' ? redirectUser : true;

    // Get the current token id
    var tokenId = typeof (app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

    // Send the current token to the tokens endpoint to delete it
    var queryStringObject = {
        'id': tokenId
    };
    app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, function (statusCode, responsePayload) {
        // Set the app.config token as false
        app.setSessionToken(false);

        // Send the user to the logged out page
        if (redirectUser) {
            window.location = '/session/deleted';
        }

    });
};

// Bind the forms
app.bindForms = function () {
    if (document.querySelector("form")) {

        var allForms = document.querySelectorAll("form");
        for (var i = 0; i < allForms.length; i++) {
            allForms[i].addEventListener("submit", function (e) {

                // Stop it from submitting
                e.preventDefault();
                var formId = this.id;
                var path = this.action;
                var method = this.method.toUpperCase();

                // Hide the error message (if it's currently shown due to a previous error)
                document.querySelector("#" + formId + " .formError").style.display = 'none';

                // Hide the success message (if it's currently shown due to a previous error)
                if (document.querySelector("#" + formId + " .formSuccess")) {
                    document.querySelector("#" + formId + " .formSuccess").style.display = 'none';
                }


                // Turn the inputs into a payload
                var payload = {};
                var elements = this.elements;
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].type !== 'submit') {
                        // Determine class of element and set value accordingly
                        var classOfElement = typeof (elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
                        var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
                        var elementIsChecked = elements[i].checked;
                        // Override the method of the form if the input's name is _method
                        var nameOfElement = elements[i].name;
                        if (nameOfElement == '_method') {
                            method = valueOfElement;
                        } else {
                            // Create an payload field named "method" if the elements name is actually httpmethod
                            if (nameOfElement == 'httpmethod') {
                                nameOfElement = 'method';
                            }
                            // Create an payload field named "id" if the elements name is actually uid
                            if (nameOfElement == 'uid') {
                                nameOfElement = 'id';
                            }
                            // If the element has the class "multiselect" add its value(s) as array elements
                            if (classOfElement.indexOf('multiselect') > -1) {
                                if (elementIsChecked) {
                                    payload[nameOfElement] = typeof (payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                                    payload[nameOfElement].push(valueOfElement);
                                }
                            } else {
                                payload[nameOfElement] = valueOfElement;
                            }

                        }
                    }
                }


                // If the method is DELETE, the payload should be a queryStringObject instead
                var queryStringObject = method == 'DELETE' ? payload : {};

                // Call the API
                app.client.request(undefined, path, method, queryStringObject, payload, function (statusCode, responsePayload) {
                    // Display an error on the form if needed
                    if (statusCode !== 200) {

                        if (statusCode == 403) {
                            // log the user out
                            app.logUserOut();

                        } else {

                            // Try to get the error from the api, or set a default error message
                            var error = typeof (responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

                            // Set the formError field with the error text
                            document.querySelector("#" + formId + " .formError").innerHTML = error;

                            // Show (unhide) the form error field on the form
                            document.querySelector("#" + formId + " .formError").style.display = 'block';
                        }
                    } else {
                        // If successful, send to form response processor
                        app.formResponseProcessor(formId, payload, responsePayload);
                    }

                });
            });
        }
    }
};

// Form response processor
app.formResponseProcessor = function (formId, requestPayload, responsePayload) {
    var functionToCall = false;
    // If account creation was successful, try to immediately log the user in
    if (formId == 'accountCreate') {
        // Take the phone and password, and use it to log the user in
        var newPayload = {
            'phone': requestPayload.phone,
            'password': requestPayload.password
        };

        app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, function (newStatusCode, newResponsePayload) {
            // Display an error on the form if needed
            if (newStatusCode !== 200) {

                // Set the formError field with the error text
                document.querySelector("#" + formId + " .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

                // Show (unhide) the form error field on the form
                document.querySelector("#" + formId + " .formError").style.display = 'block';

            } else {
                // If successful, set the token and redirect the user
                app.setSessionToken(newResponsePayload);
                app.loadMenuInfo(newPayload.phone);
                // window.location = '/menu';
            }
        });
    }
    // If login was successful, set the token in localstorage and redirect the user
    if (formId == 'sessionCreate') {
        app.setSessionToken(responsePayload);
        // window.location = '/menu';
        app.loadMenuInfo(requestPayload.phone);
    }

    // If forms saved successfully and they have success messages, show them
    var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2', 'checksEdit1'];
    if (formsWithSuccessMessages.indexOf(formId) > -1) {
        document.querySelector("#" + formId + " .formSuccess").style.display = 'block';
    }

    // If the user just deleted their account, redirect them to the account-delete page
    if (formId == 'accountEdit3') {
        app.logUserOut(false);
        window.location = '/account/deleted';
    }

    // // If the user just created a new check successfully, redirect back to the dashboard
    // if (formId == 'checksCreate') {
    //     window.location = '/checks/all';
    // }

    // // If the user just deleted a check, redirect them to the dashboard
    // if (formId == 'checksEdit2') {
    //     window.location = '/checks/all';
    // }

};

app.loadMenuInfo = (userPhone) => {
    const queryStringObject = {
        phone: userPhone
    }

    app.client.request(undefined, 'api/menu', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
        // Display an error on the form if needed
        if (statusCode == 200) {
            localStorage.setItem('menuItems', JSON.stringify(responsePayload));
            window.location = '/menu';
        } else {
            localStorage.setItem('menuItems', JSON.stringify([]));
            window.location = '/menu';
        }
    });
}

// Get menu items for localStorage
app.getMenuItems = () => {
    app.menuItems = JSON.parse(localStorage.getItem('menuItems'));
}

app.btnClickHandler = (e) => {

    const getStorage = JSON.parse(localStorage.getItem('order'));
    let existingOrder = [];
    if (getStorage !== null && getStorage.hasOwnProperty('menuItems')) {
        existingOrder = getStorage.menuItems;
    }

    const btnClassName = e.target.className;
    const btnType = btnClassName.split('_')[0];

    const orderData = {
        'userPhone': JSON.parse(localStorage.getItem('token')).phone,
        'menuItems': []
    };

    // if there is already any item in shoping card
    if (existingOrder.length > 0) {
        orderData.menuItems = existingOrder;
    }

    const liElSelector = e.target.className.split(`${btnType}_`)[1];
    if (btnType == 'addBtn') {
        const allElementsP = document.querySelectorAll(`.${liElSelector} p`);
        const allElementsInput = document.querySelectorAll(`.${liElSelector} input`);
        const menuItem = {
            'id': allElementsInput[0].value,
            'itemName': allElementsP[0].innerHTML,
            'quantity': allElementsInput[1].value,
            'singlePrice': +allElementsP[1].innerHTML.split('Single Pice: ')[1]

        }
        orderData.menuItems.push(menuItem);
        localStorage.setItem('order', JSON.stringify(orderData));
        // prevent adding this item again  to the card
        document.querySelector(`.${btnClassName}`).disabled = true;
        document.querySelector(`.${btnClassName.replace('addBtn', 'btnRemove')}`).disabled = false;
    }

    if (btnType == 'btnRemove') {
        const currentItemId = document.querySelectorAll(`.${liElSelector} input`)[0].value;
        const filtered = existingOrder.filter(item => item.id != currentItemId);

        orderData.menuItems = filtered;
        localStorage.setItem('order', JSON.stringify(orderData));
        // enable adding the item to the card after remove
        document.querySelector(`.${btnClassName.replace('btnRemove', 'addBtn')}`).disabled = false;
        document.querySelector(`.menuItem_${btnClassName.split('_')[2]} input[type='number']`).value = 0;
    }


}

// Load data on menu page
app.loadMenuPage = () => {

    let menuListEl;

    for (let i = 0; i < app.menuItems.length; i++) {

        const pElement = document.createElement('p');
        const p2Element = document.createElement('p');
        const pText = document.createTextNode(`${app.menuItems[i].name}`);
        const p2Text = document.createTextNode(`Single Pice: ${app.menuItems[i].price}`);
        pElement.appendChild(pText);
        p2Element.appendChild(p2Text);

        const input = document.createElement('INPUT');
        const inputHidden = document.createElement('INPUT');
        input.setAttribute('type', 'number');
        input.setAttribute('value', '0');
        inputHidden.setAttribute('type', 'hidden');
        inputHidden.setAttribute('class', 'itemId');
        inputHidden.setAttribute('value', app.menuItems[i].id);

        const btn = document.createElement('BUTTON');
        btn.innerHTML = 'add to card';
        btn.setAttribute('class', `addBtn_menuItem_${i}`);
        btn.addEventListener('click', app.btnClickHandler);
        const btnRemove = document.createElement('BUTTON');
        btnRemove.innerHTML = 'remove form card';
        btnRemove.setAttribute('class', `btnRemove_menuItem_${i}`);
        btnRemove.addEventListener('click', app.btnClickHandler);

        // create Li element and append inner elements
        const liElement = document.createElement('LI');
        liElement.setAttribute('class', `menuItem_${i}`);
        liElement.appendChild(pElement);
        liElement.appendChild(p2Element);
        liElement.appendChild(inputHidden);
        liElement.appendChild(input);
        liElement.appendChild(btn);
        liElement.appendChild(btnRemove);
        document.querySelector('#menuList').appendChild(liElement)

    }

    const getOrder = JSON.parse(localStorage.getItem('order'));
    if (getOrder !== null) {
        app.loadExistingOrder(getOrder.menuItems);
    }

}

app.loadExistingOrder = (orderItems) => {

    for (let i = 0; i < orderItems.length; i++) {
        document.querySelector(`.menuItem_${(+orderItems[i].id -1)} input[type='number']`).value = orderItems[i].quantity;
        document.querySelector(`.addBtn_menuItem_${(+orderItems[(i)].id -1)}`).disabled = true;
    }
}

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function () {
    var tokenString = localStorage.getItem('token');
    if (typeof (tokenString) == 'string') {
        try {
            var token = JSON.parse(tokenString);
            app.config.sessionToken = token;
            if (typeof (token) == 'object') {
                app.setLoggedInClass(true);
            } else {
                app.setLoggedInClass(false);
            }
        } catch (e) {
            app.config.sessionToken = false;
            app.setLoggedInClass(false);
        }
    }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function (add) {
    var target = document.querySelector("body");
    if (add) {
        target.classList.add('loggedIn');
    } else {
        target.classList.remove('loggedIn');
    }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function (token) {
    app.config.sessionToken = token;
    var tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
    if (typeof (token) == 'object') {
        app.setLoggedInClass(true);
    } else {
        app.setLoggedInClass(false);
    }
};

// Renew the token
app.renewToken = function (callback) {
    var currentToken = typeof (app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
    if (currentToken) {
        // Update the token with a new expiration
        var payload = {
            'id': currentToken.id,
            'extend': true,
        };
        app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode == 200) {
                // Get the new token details
                var queryStringObject = {
                    'id': currentToken.id
                };
                app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
                    // Display an error on the form if needed
                    if (statusCode == 200) {
                        app.setSessionToken(responsePayload);
                        callback(false);
                    } else {
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            } else {
                app.setSessionToken(false);
                callback(true);
            }
        });
    } else {
        app.setSessionToken(false);
        callback(true);
    }
};

// Load data on the page
app.loadDataOnPage = function () {
    // Get the current page from the body class
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof (bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

    // Logic for account settings page
    if (primaryClass == 'accountEdit') {
        app.loadAccountEditPage();
    }

    // Logic for dashboard page
    if (primaryClass == 'checksList') {
        app.loadChecksListPage();
    }

    // Logic for check details page
    if (primaryClass == 'checksEdit') {
        app.loadChecksEditPage();
    }

    if (primaryClass == 'menuSection') {
        app.loadMenuPage();
    }

    if (primaryClass == 'shoppingCardSection') {
        app.loadShoppingCard();
    }

    if (primaryClass == 'confirmationPayment') {
        app.loadConfirmationPayment();
    }

};

// Load the account edit page specifically
app.loadAccountEditPage = function () {
    // Get the phone number from the current token, or log the user out if none is there
    var phone = typeof (app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
    if (phone) {
        // Fetch the user data
        var queryStringObject = {
            'phone': phone
        };
        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
            if (statusCode == 200) {
                // Put the data into the forms as values where needed
                document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
                document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
                document.querySelector("#accountEdit1 .email").value = responsePayload.email;
                document.querySelector("#accountEdit1 .address").value = responsePayload.address;
                document.querySelector("#accountEdit1 .displayPhoneInput").value = phone;

                // Put the hidden phone field into both forms
                var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
                for (var i = 0; i < hiddenPhoneInputs.length; i++) {
                    hiddenPhoneInputs[i].value = phone;
                }

            } else {
                // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                app.logUserOut();
            }
        });
    } else {
        app.logUserOut();
    }
};

// Load the dashboard page specifically
app.loadChecksListPage = function () {
    // Get the phone number from the current token, or log the user out if none is there
    var phone = typeof (app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
    if (phone) {
        // Fetch the user data
        var queryStringObject = {
            'phone': phone
        };
        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
            if (statusCode == 200) {

                // Determine how many checks the user has
                var allChecks = typeof (responsePayload.checks) == 'object' && responsePayload.checks instanceof Array && responsePayload.checks.length > 0 ? responsePayload.checks : [];
                if (allChecks.length > 0) {

                    // Show each created check as a new row in the table
                    allChecks.forEach(function (checkId) {
                        // Get the data for the check
                        var newQueryStringObject = {
                            'id': checkId
                        };
                        app.client.request(undefined, 'api/checks', 'GET', newQueryStringObject, undefined, function (statusCode, responsePayload) {
                            if (statusCode == 200) {
                                var checkData = responsePayload;
                                // Make the check data into a table row
                                var table = document.getElementById("checksListTable");
                                var tr = table.insertRow(-1);
                                tr.classList.add('checkRow');
                                var td0 = tr.insertCell(0);
                                var td1 = tr.insertCell(1);
                                var td2 = tr.insertCell(2);
                                var td3 = tr.insertCell(3);
                                var td4 = tr.insertCell(4);
                                td0.innerHTML = responsePayload.method.toUpperCase();
                                td1.innerHTML = responsePayload.protocol + '://';
                                td2.innerHTML = responsePayload.url;
                                var state = typeof (responsePayload.state) == 'string' ? responsePayload.state : 'unknown';
                                td3.innerHTML = state;
                                td4.innerHTML = '<a href="/checks/edit?id=' + responsePayload.id + '">View / Edit / Delete</a>';
                            } else {
                                console.log("Error trying to load check ID: ", checkId);
                            }
                        });
                    });

                    if (allChecks.length < 5) {
                        // Show the createCheck CTA
                        document.getElementById("createCheckCTA").style.display = 'block';
                    }

                } else {
                    // Show 'you have no checks' message
                    document.getElementById("noChecksMessage").style.display = 'table-row';

                    // Show the createCheck CTA
                    document.getElementById("createCheckCTA").style.display = 'block';

                }
            } else {
                // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                app.logUserOut();
            }
        });
    } else {
        app.logUserOut();
    }
};

app.submitOrder = () => {

    const getOrder = JSON.parse(localStorage.getItem('order'));
    const getOrderId = JSON.parse(localStorage.getItem('orderId'));

    if (getOrder != null) {

        if (getOrderId === null) {
            app.client.request(undefined, 'api/shoppingCard', 'POST', undefined, getOrder, function (newStatusCode, newResponsePayload) {
                // Display an error on the form if needed
                if (newStatusCode !== 200) {

                    //TODO: show error msg

                } else {
                    // If successful, set the token and redirect the user
                    localStorage.setItem('orderId', JSON.stringify(newResponsePayload.orderId));
                    window.location = '/shoppingCard';
                }
            });
        }

        if (getOrderId !== null) {
            getOrder.orderId = getOrderId;
            app.client.request(undefined, 'api/shoppingCard', 'PUT', undefined, getOrder, function (newStatusCode, newResponsePayload) {
                // Display an error on the form if needed
                if (newStatusCode !== 200) {

                    //TODO: show error msg

                } else {
                    // If successful, set the token and redirect the user
                    window.location = '/shoppingCard';
                }
            });
        }

    } else {
        window.location = '/shoppingCard';
    }

};

app.addEventsListener = () => {
    const submitBrn = document.querySelector('.submitOrder');
    if (submitBrn) {
        submitBrn.addEventListener('click', app.submitOrder);
    }

    const payBtn = document.querySelector('.payButton');
    if (payBtn) {
        payBtn.addEventListener('click', app.payButton);
    }
}

app.loadShoppingCard = () => {
    const getOrder = JSON.parse(localStorage.getItem('order'));

    if (getOrder === null) {
        document.querySelector('.errorMassage').innerHTML = 'You didn\'t add nothing to the shopping card yet.';
        document.querySelector('.order-info').style.display = 'none';
    } else {
        document.querySelector('.order-info').style.display = 'block';

        //orderDetails
        const order = JSON.parse(localStorage.getItem('order'));
        let totalPrice = 0;
        for (let i = 0; i < order.menuItems.length; i++) {
            console.log('app.menuItems[i]: ', order.menuItems[i]);

            const liElement = document.createElement('li');
            const liText = document.createTextNode(`${order.menuItems[i].itemName}, quantity: ${order.menuItems[i].quantity}, single price ${order.menuItems[i].singlePrice} `);
            liElement.appendChild(liText);

            totalPrice =+ (order.menuItems[i].singlePrice * order.menuItems[i].quantity);
            document.querySelector('.orderDetails ul').appendChild(liElement)
        }

        const lastLiiElement = document.createElement('li');
        const lastLiiText = document.createTextNode(`total price: ${totalPrice}`);
        lastLiiElement.appendChild(lastLiiText);

        document.querySelector('.orderDetails ul').appendChild(lastLiiElement);
    }
}

app.payButton = () => {
    console.log('payButton!!!');
    const getOrder = JSON.parse(localStorage.getItem('order'));
    const getOrderId = JSON.parse(localStorage.getItem('orderId'));

    if (getOrder.userPhone != null) {

        if (getOrderId !== null) {
            const paymentData ={
               'orderId':  getOrderId,
               'userPhone': getOrder.userPhone,
               'cardNumber': document.querySelector('#cardnumber').value ,
               'cardExpiryDate': document.querySelector('#expirationdate').value,
               'cardHolder': document.querySelector('#name').value,
               'cardCVVCode': document.querySelector('#securitycode').value
            }
            app.client.request(undefined, 'api/payment', 'POST', undefined, paymentData, function (newStatusCode, newResponsePayload) {
                // Display an error on the form if needed
                if (newStatusCode !== 200) {

                    //TODO: show error msg

                } else {
                    localStorage.setItem('paymentResponse' , JSON.stringify(newResponsePayload))
                    window.location = '/confirmationPayment';
                }
            });
        }

    } else {
        window.location = '/confirmationPayment';
    }
}

app.loadConfirmationPayment = () => {
    const responseMessage = JSON.parse(localStorage.getItem('paymentResponse'));
    const msgElement = document.querySelector('.response-msg');

    if(msgElement){
        msgElement.textContent = responseMessage.Message
    }
}


// Loop to renew token often
app.tokenRenewalLoop = function () {
    setInterval(function () {
        app.renewToken(function (err) {
            if (!err) {
                console.log("Token renewed successfully @ " + Date.now());
            }
        });
    }, 1000 * 60);
};

// Init (bootstrapping)
app.init = function () {

    app.addEventsListener();

    // Bind all form submissions
    app.bindForms();

    // Bind logout logout button
    app.bindLogoutButton();

    // Get the token from localstorage
    app.getSessionToken();

    // Renew token
    app.tokenRenewalLoop();

    // Get the token from localstorage
    app.getMenuItems();

    // Load data on page
    app.loadDataOnPage();


};

// Call the init processes after the window loads
window.onload = function () {
    app.init();
};