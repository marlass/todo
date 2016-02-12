module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                'database': 'localhost/todo',
                'secret': 'ilovescotchyscotch'
            };
        case 'production':
            return {
                'database': 'localhost/todo',
                'secret': 'ilovescotchyscotch'
            };
        case 'test':
            return {
                'database': 'localhost/todo_test',
                'secret': 'ilovescotchyscotch'
            }
        default:
            return {
                'database': 'localhost/todo',
                'secret': 'ilovescotchyscotch'
            };
    }
};