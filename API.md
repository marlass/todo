#API

##Task
URI | Method | Action |
----|--------|--------|
tasks/id|GET|Return data about specific task|
tasks/id|PUT|Updates specific task|
tasks/|POST|Add new task|
tasks/id|DELETE|Delete specific task|

##List task
URI | Method | Action |
----|--------|--------|
tasks/|GET|Return list of all tasks|
tasks/tag/tag_name|GET|Return list of all tasks with tag = tag_name|
tasks/project/project_name|GET|Return list of all tasks with project = project_name|
tasks/priority/priority_value|GET|Return list of all tasks with specified priority|
tasks/status/status|GET|Return list of all tasks with specified status|
tasks/deadline/deadline_value|GET|Return all tasks with specified deadline|
tasks/size/size_value|GET|Return all tasks with time spend on them = size_value|

