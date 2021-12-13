# My Sorting Table
Simple class to perform the table sort: was created specifically to compensate for the fact that - sometimes - sorting datatables cannot be applied.<br>
The other usefulness is that it's a single file. It does not depend on any other file (css, javascript, etc.)
# Demo
https://davidrevenge.github.io/mysortingtable/

# To initialize the table
## 1. Download
### Download the MySortingTable.js file and add the following code before the closing body tag (with the path of file)
```html
<script src="MySortingTable.js"></script>
</body>
```
## 2. Add classes for sort the table
### Add the .toSort class to the th to be sorted.
```html
<thead>
  <tr>
    <th scope="col" class="toSort">Column Name</th>
```
### If you want to auto-load the table, add the .defaultSort class to the corresponding th.
```html
<thead>
  <tr>
    <th scope="col" class="toSort defaultSort">Column Name</th>
```
## 3. Load the table
### First example
```html
<script>
    var table = new MySortingTable('#table_id'); //'#table_id' is the css table selector
</script>
```
### Second example
```html
<script>
    var table = new MySortingTable('.table_class'); //'.table_class' is the css table selector (multiple tables supported)
</script>
```

# Complete example
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example</title>
</head>

<body>
    <table id="table_id" class="table_class">
        <thead>
            <tr>
                <th scope="col" class="toSort defaultSort">Name</th>
                <th scope="col" class="toSort">Age</th>
                <th scope="col">Third Column</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    Goofy
                </td>
                <td>89</td>
                <td>
                   Third Column Text
                </td>
            </tr>

            <tr>
                <td>
                    Mickey Mouse
                </td>
                <td>93</td>
                <td>
                   Third Column Text
                </td>
            </tr>
        </tbody>
    </table>

    <script src="MySortingTable.js"></script>
    <script>
        var table = new MySortingTable('#table_id');
    </script>
</body>
</html>
```
# If you give me a coffee, I'll gladly go and drink it :-D! <br>
![image](https://user-images.githubusercontent.com/767664/145684817-aa4cc3ce-379d-4ac9-8a34-b623b41fdc03.png)

https://www.paypal.com/donate/?hosted_button_id=5EKCKBZF7Q7C4

# I also gladly accept crypto currencies if you want :-)

![image](https://user-images.githubusercontent.com/767664/145684749-3a2771f4-372f-47bc-be1e-a2850b681a30.png)

![image](https://user-images.githubusercontent.com/767664/145684842-a19481f0-2e48-408b-8024-763aff28296e.png)

![image](https://user-images.githubusercontent.com/767664/145684928-4c8e9917-4121-4e42-a02e-e3640032f5c6.png)

![image](https://user-images.githubusercontent.com/767664/145684939-972b40df-6891-4de0-aec3-623e3ece79de.png)
