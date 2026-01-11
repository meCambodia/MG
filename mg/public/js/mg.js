// MG Custom Scripts for Frappe

console.log('MG Custom App Loaded');

frappe.provide('mg');

// Add a custom event listener or modification when the page is ready
$(document).on('app_ready', function() {
    console.log('Frappe App Ready - Applying MG Customizations');
    
    // Example: Add a class to the body for scoping if needed
    $('body').addClass('mg-theme');
});

// Example of overriding a standard Frappe function or adding a utility
mg.utils = {
    animate_element: function(selector, animation_class) {
        $(selector).addClass('animate__animated ' + animation_class);
    }
};

// Hook into route changes to re-apply certain styles if dynamic loading messes them up
frappe.router.on('change', function() {
    // console.log('Route changed');
});
