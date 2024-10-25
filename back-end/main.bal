import ballerina/http;
import ballerinax/mysql;
import ballerina/sql;
import ballerinax/mysql.driver as _;
import ballerina/uuid;

final mysql:Client dbClient = check new(
    host = "localhost",
    user = "root",
    password = "Aaishah1234",
    port = 3306,
    database = "meal_management"
);

    @http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowHeaders: ["REQUEST_ID", "Content-Type"],
        exposeHeaders: ["RESPONSE_ID"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        maxAge: 84900
    }
}



service /api on new http:Listener(9090) {


resource function post signin(http:Caller caller, LoginRequest loginRequest) returns error? {
    sql:ParameterizedQuery selectQuery = `SELECT id, mail, name, password FROM Employee WHERE mail = ${loginRequest.mail}`;
    stream<Employee, sql:Error?> resultStream = dbClient->query(selectQuery);

    Employee? employee;
    check from Employee emp in resultStream do {
        employee = emp;
    };

    if employee is () {
        http:Response res = new;
        res.statusCode = 404;
        res.setPayload({message: "User not found"});
        check caller->respond(res);
        return;
    }

    if employee.password == loginRequest.password {
        // Successful login, generate session token
        string sessionId = uuid:createType1AsString();  // Create a new UUID session ID
        
        // Insert the session ID into the Sessions table
        sql:ParameterizedQuery insertSessionQuery = `INSERT INTO Sessions (employeeId, sessionId) 
            VALUES (${employee.id}, ${sessionId})`;
        sql:ExecutionResult _ = check dbClient->execute(insertSessionQuery);  // Discard result

        // Return session ID to the client
        UserData userData = {
            id: employee.id,
            name: employee.name,
            mail: employee.mail
        };
        
        http:Response res = new;
        res.addHeader("session-token", sessionId);  // Return the session token as a header
        res.setPayload(userData);  // Send user data back to the client
        check caller->respond(res);
    } else {
        http:Response res = new;
        res.statusCode = 401;
        res.setPayload({message: "Invalid credentials"});
        check caller->respond(res);
    }
}




    // Sign up (Register)
    resource function post signup(http:Caller caller, NewEmployee newEmployee) returns error? {
      
        sql:ParameterizedQuery selectQuery = `SELECT id FROM Employee WHERE mail = ${newEmployee.mail}`;
        
        stream<Employee, sql:Error?> resultStream = dbClient->query(selectQuery);
        Employee? existingEmployee;
        check from Employee emp in resultStream
            do {
                existingEmployee = emp;
            };

        if existingEmployee is Employee {
          
            http:Response res = new;
            res.statusCode = 409;
            res.setPayload({message: "Email already exists"});
            check caller->respond(res);
            return;
        }

        sql:ParameterizedQuery insertQuery = `INSERT INTO Employee (mail, name, password)
            VALUES (${newEmployee.mail}, ${newEmployee.name}, ${newEmployee.password})`;
        var result = dbClient->execute(insertQuery);

        if result is sql:ExecutionResult {
         
            http:Response res = new;
            res.statusCode = 201;
            res.setPayload({message: "Employee registered successfully"});
            check caller->respond(res);
        } else {
           
            http:Response res = new;
            res.statusCode = 500;
            res.setPayload({message: "Failed to register employee"});
            check caller->respond(res);
        }
    }


resource function post logout(http:Caller caller, string sessionId) returns error? {
    // Delete the session using the sessionId
    sql:ParameterizedQuery deleteSessionQuery = `DELETE FROM Sessions WHERE sessionId = ${sessionId}`;
    var result = dbClient->execute(deleteSessionQuery);
    
    http:Response res = new;
    if result is sql:ExecutionResult {
        res.setPayload({message: "Logout successful"});
    } else {
        res.statusCode = 500;
        res.setPayload({message: "Failed to log out"});
    }
    check caller->respond(res);
}





    // Get all orders
    resource function get orders() returns Order1[] | error {
        Order1[] orders = [];
        stream<Order1, sql:Error?> orderStream = dbClient->query(
            `SELECT id, employeeId, mealtypeId, mealtimeId, date FROM Order1`
        );
        check from Order1 order1 in orderStream
            do {
                orders.push(order1);
            };
        return orders;
    }

    // Post a new order
    resource function post orders(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        NewOrder1 newOrder1 = check payload.cloneWithType(NewOrder1);

       
        sql:ParameterizedQuery insertQuery = `INSERT INTO Order1 (employeeId, mealtypeId, mealtimeId, date)
            VALUES (${newOrder1.employeeId}, ${newOrder1.mealtypeId}, ${newOrder1.mealtimeId}, ${newOrder1.date})`;
        var result = dbClient->execute(insertQuery);
        if result is sql:ExecutionResult {
            check caller->respond({message: "Order added successfully"});
        } else {
            check caller->respond({message: "Failed to add order"});
        }
    }

    // Delete an order by ID
resource function delete orders(http:Caller caller, http:Request req) returns error? {
    
    string? orderIdStr = req.getQueryParamValue("id");

    if orderIdStr is string {
        
        int orderId = check int:fromString(orderIdStr);

        sql:ParameterizedQuery deleteQuery = `DELETE FROM Order1 WHERE id = ${orderId}`;
        var result = dbClient->execute(deleteQuery);

        http:Response res = new;
        if result is sql:ExecutionResult {
            if result.affectedRowCount > 0 {
                res.setPayload({message: "Order deleted successfully"});
            } else {
                res.statusCode = 404;  
                res.setPayload({message: "Order not found"});
            }
        } else {
            res.statusCode = 500;  
            res.setPayload({message: "Failed to delete order"});
        }

      
        check caller->respond(res);
    } else {
    
        http:Response res = new;
        res.statusCode = 400;  // Bad request
        res.setPayload({message: "Missing order ID in query parameters"});
        check caller->respond(res);
    }
}


// Get an order by ID
resource function get orders/[int orderId](http:Caller caller) returns error? {

    
    sql:ParameterizedQuery selectQuery = `SELECT id, employeeId, mealtypeId, mealtimeId, date 
                                          FROM Order1 WHERE id = ${orderId}`;
    stream<Order1, sql:Error?> orderStream = dbClient->query(selectQuery);

    Order1? order1;
    check from Order1 o in orderStream
        do {
            order1 = o;
        };

   
    http:Response res = new;
    if order1 is Order1 {
        res.setPayload(order1);  
    } else {
        res.statusCode = 404;  
        res.setPayload({message: "Order not found"});
    }

    
    check caller->respond(res);
}


// Get all orders for a specific employee
resource function get ordersForEmployee/[int employeeId](http:Caller caller) returns error? {

    // SQL query to get all orders for the given employeeId
    sql:ParameterizedQuery selectQuery = `SELECT id, employeeId, mealtypeId, mealtimeId, date 
                                          FROM Order1 WHERE employeeId = ${employeeId}`;
    stream<Order1, sql:Error?> orderStream = dbClient->query(selectQuery);

    // Create a list to store the orders
    Order1[] employeeOrders = [];

    // Collect all orders from the stream
    check from Order1 order1 in orderStream
        do {
            employeeOrders.push(order1);
        };

    http:Response res = new;
    if employeeOrders.length() > 0 {
        // Return the list of orders if found
        res.setPayload(employeeOrders);
    } else {
        // Return a 404 error if no orders are found for the employee
        res.statusCode = 404;
        res.setPayload({message: "No orders found for the given employee"});
    }

    // Send the response back to the client
    check caller->respond(res);
}

    // Post a new employee
    resource function post employees(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        NewEmployee newEmployee = check payload.cloneWithType(NewEmployee);

        
        sql:ParameterizedQuery insertQuery = `INSERT INTO Employee (mail, name, password)
            VALUES (${newEmployee.mail}, ${newEmployee.name}, ${newEmployee.password})`;
        var result = dbClient->execute(insertQuery);
        if result is sql:ExecutionResult {
            check caller->respond({message: "Employee added successfully"});
        } else {
            check caller->respond({message: "Failed to add employee"});
        }
    }

//get orders made in a day by an emp
resource function get orderDetailsForEmployeeOnDate(http:Caller caller, http:Request req, string employeeId, string orderDate) returns error? {
   
    sql:ParameterizedQuery selectQuery = `SELECT id, employeeId, mealtypeId, mealtimeId, date 
                                          FROM Order1 WHERE employeeId = ${employeeId} AND date = ${orderDate}`;
    
    stream<Order1, sql:Error?> orderStream = dbClient->query(selectQuery);

    Order1[] employeeOrders = [];
   
    check from Order1 order1 in orderStream
        do {
            employeeOrders.push(order1);
        };

    http:Response res = new;
    if employeeOrders.length() > 0 {
        res.setPayload(employeeOrders);  
    } else {
        res.statusCode = 404; 
        res.setPayload({message: "No orders found for the given employee and date"});
    }

    check caller->respond(res);
}

    // Get all employees
    resource function get employees() returns Employee[] | error {
        Employee[] employees = [];
        stream<Employee, sql:Error?> employeeStream = dbClient->query(
            `SELECT id, mail, name, password FROM Employee`
        );
        check from Employee employee in employeeStream
            do {
                employees.push(employee);
            };
        return employees;
    }



// Delete an employee by ID
resource function delete employees(http:Caller caller, http:Request req) returns error? {
   
    string? employeeIdStr = req.getQueryParamValue("id");
    
  
    if employeeIdStr is string {
        int employeeId = check int:fromString(employeeIdStr);

        
        sql:ParameterizedQuery deleteQuery = `DELETE FROM Employee WHERE id = ${employeeId}`;
        var result = dbClient->execute(deleteQuery);
        
      
        http:Response res = new;
        if result is sql:ExecutionResult {
         
            if result.affectedRowCount > 0 {
                res.setPayload({message: "Employee deleted successfully"});
            } else {
                res.statusCode = 404;  // Employee not found
                res.setPayload({message: "Employee not found"});
            }
        } else {
            res.statusCode = 500;  // Internal server error
            res.setPayload({message: "Failed to delete employee"});
        }
        
        check caller->respond(res);
    } else {
       
        http:Response res = new;
        res.statusCode = 400;  // Bad request
        res.setPayload({message: "Missing employee ID in query parameters"});
        check caller->respond(res);
    }
}


// Get all food items
resource function get fooditems() returns FoodItem[] | error {
    FoodItem[] foodItems = [];
   
    stream<FoodItem, sql:Error?> foodItemStream = dbClient->query(
        `SELECT id, foodName, foodType FROM FoodItems`
    );
    
    check from FoodItem foodItem in foodItemStream
        do {
            foodItems.push(foodItem);
        };
    
    return foodItems;
}

// Post a new food item
resource function post fooditems(http:Caller caller, http:Request req) returns error? {
    // Parse the request payload as a JSON object
    json payload = check req.getJsonPayload();
    
    // Convert the JSON object to the `FoodItem` type
    FoodItem newFoodItem = check payload.cloneWithType(FoodItem);
    
    // SQL query to insert the new food item into the database
    sql:ParameterizedQuery insertQuery = `INSERT INTO FoodItems (foodName, foodType) 
                                          VALUES (${newFoodItem.foodName}, ${newFoodItem.foodType})`;
    
    // Execute the insert query
    var result = dbClient->execute(insertQuery);
    
    http:Response res = new;
    
    if result is sql:ExecutionResult {
     
        res.statusCode = 201; // Created
        res.setPayload({message: "Food item added successfully"});
    } else {
       
        res.statusCode = 500; // Internal Server Error
        res.setPayload({message: "Failed to add food item"});
    }
    
   
    check caller->respond(res);
}



   // Get order count for a specific date
resource function get orderCountsForDate(http:Caller caller, http:Request req, string inputDate) returns error? {
    // Map for mealtime names
    map<string> mealtimeNames = {
        "1": "Breakfast",
        "2": "Lunch",
        "3": "Dinner"
    };
    // Initialize response map
    map<map<string>> mealTimeCounts = {
        "Breakfast": { "veg_count": "0", "nonveg_count": "0", "egg_count": "0" },
        "Lunch": { "veg_count": "0", "nonveg_count": "0", "egg_count": "0" },
        "Dinner": { "veg_count": "0", "nonveg_count": "0", "egg_count": "0" }
    };
    // Stream SQL results
    stream<OrderCountRecord, sql:Error?> countStream = dbClient->query(
        `SELECT 
    c.id AS mealtimeId, 
    IFNULL(t.id, 0) AS mealtypeId,  -- Replace null values with 0
    CAST(SUM(CASE WHEN o.id IS NOT NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS count
FROM 
    Mealtime c
LEFT JOIN 
    Order1 o ON o.mealtimeId = c.id AND o.date = ${inputDate}
LEFT JOIN 
    Mealtype t ON o.mealtypeId = t.id
GROUP BY 
    c.id, t.id
ORDER BY 
    c.id;
        `
    );
    check from OrderCountRecord record1 in countStream
        do {
            string? mealtimeName = mealtimeNames[record1.mealtimeId.toString()]; 
            
            if mealtimeName is string { 
                
                string countStr = record1.count.toString(); 
                if record1.mealtypeId == 1 { // Veg
                    mealTimeCounts[mealtimeName]["veg_count"] = countStr;
                } else if record1.mealtypeId == 2 { // Non-Veg
                    mealTimeCounts[mealtimeName]["nonveg_count"] = countStr;
                } else if record1.mealtypeId == 3 { // Egg
                    mealTimeCounts[mealtimeName]["egg_count"] = countStr;
                }
            } else {
                
            }
        };
   
    check caller->respond(mealTimeCounts);
}
}



// Types

public type MySession object {
    public string sessionId;
    
};

public type LoginRequest record {|
    string mail;
    string password;
|};

public type UserData record {|
    readonly int id;
    string name;
    string mail;
|};

public type Employee record {|
    readonly int id;
    string mail;
    string name;
    string password;
|};

public type NewEmployee record {|
    string mail;
    string name;
    string password;
|};
public type Mealtime record {|
    readonly int id;
    string name;
|};

public type Mealtype record {|
    readonly int id;
    string name;
|};

public type Order1 record {|
    readonly int id;
    int employeeId;
    int mealtypeId;
    int mealtimeId;
    string date;
|};

public type FoodItem record {|
    readonly int id?;
    string foodName;
    string foodType;
|};

public type NewOrder1 record {|
    int employeeId;
    int mealtypeId;
    int mealtimeId;
    string date;
|};

type OrderCreated1 record {|
    *http:Created;
    Order1 body;
|};



type MealCountRecord record {|
    int mealtypeId;
    int count;
|};

type OrderCountRecord record {|
    int mealtimeId;
    int mealtypeId;
    int count;
|};
