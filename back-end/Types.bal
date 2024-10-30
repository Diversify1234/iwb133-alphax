// Types
import ballerina/http;

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
