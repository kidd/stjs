Suppose we create a promise that deliberately fails and then add two error handlers:

<%- include('/_inc/file.html', {file: 'multiple-catch/example.js'}) %>

<p class="noindent">When the code is run it produces:</p>

<%- include('/_inc/file.html', {file: 'multiple-catch/example.txt'}) %>

1.  Trace the order of operations: what is created and executed when?
2.  What happens if we run these same lines interactively?
    Why do we see something different than what we see when we run this file from the command line?