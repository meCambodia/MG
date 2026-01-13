// MG Custom Scripts for Frappe - Enhanced Version

console.log('MG Custom App Loaded');

frappe.provide('mg');

// Initialize MG Custom App
mg.init = function() {
    console.log('Frappe App Ready - Applying MG Customizations');
    
    // Add theme class to body
    $('body').addClass('mg-theme');
    
    // Apply fade-in animation to dynamically loaded content
    mg.utils.applyFadeIn();
    
    // Enhance form controls
    mg.utils.enhanceFormControls();
    
    // Add smooth scrolling
    mg.utils.enableSmoothScroll();
    
    // Enhance tooltips
    mg.utils.enhanceTooltips();
    
    // Add keyboard shortcuts
    mg.utils.setupKeyboardShortcuts();
};

// Utility Functions
mg.utils = {
    // Animate element with fade-in
    animate_element: function(selector, animation_class) {
        $(selector).addClass('animate__animated ' + animation_class);
    },
    
    // Apply fade-in to dynamically loaded content
    applyFadeIn: function() {
        // Apply to new list rows
        $(document).on('DOMNodeInserted', '.list-row, .grid-row', function() {
            $(this).addClass('fade-in');
        });
        
        // Apply to modals when opened
        $(document).on('show.bs.modal', '.modal', function() {
            $(this).find('.modal-content').addClass('fade-in');
        });
    },
    
    // Enhance form controls with better UX
    enhanceFormControls: function() {
        // Add focus states to form controls
        $(document).on('focus', '.form-control, .form-select', function() {
            $(this).closest('.form-group, .control-input-wrapper').addClass('is-focused');
        });
        
        $(document).on('blur', '.form-control, .form-select', function() {
            $(this).closest('.form-group, .control-input-wrapper').removeClass('is-focused');
        });
        
        // Add floating label effect if needed
        $(document).on('input change', '.form-control', function() {
            if ($(this).val()) {
                $(this).addClass('has-value');
            } else {
                $(this).removeClass('has-value');
            }
        });
    },
    
    // Enable smooth scrolling
    enableSmoothScroll: function() {
        $('html').css('scroll-behavior', 'smooth');
        
        // Smooth scroll for anchor links
        $(document).on('click', 'a[href^="#"]', function(e) {
            const target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 500);
            }
        });
    },
    
    // Enhance tooltips with better styling
    enhanceTooltips: function() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    },
    
    // Setup keyboard shortcuts (minimal - only essential ones)
    setupKeyboardShortcuts: function() {
        $(document).on('keydown', function(e) {
            // Escape to close modals
            if (e.key === 'Escape') {
                $('.modal.show').modal('hide');
            }
        });
    },
    
    // Show notification with custom styling
    showNotification: function(message, type = 'info', duration = 3000) {
        const alertClass = type === 'error' ? 'alert-danger' : 
                          type === 'success' ? 'alert-success' : 
                          type === 'warning' ? 'alert-warning' : 'alert-info';
        
        const notification = $(`
            <div class="alert ${alertClass} alert-dismissible fade show mg-notification" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: var(--shadow-lg);">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, duration);
    },
    
    // Format numbers with thousand separators
    formatNumber: function(num, decimals = 2) {
        return parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for performance
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Customize Help Menu
mg.customizeHelpMenu = function() {
    // Wait for Frappe toolbar to be ready
    if (typeof frappe.ui.toolbar !== 'undefined' && frappe.ui.toolbar.clear_help) {
        try {
            // Clear existing help menu (removes all items including keyboard shortcuts)
            frappe.ui.toolbar.clear_help();
            
            // Add custom help menu items
            if (frappe.ui.toolbar.add_help_menu_item) {
                // Add "About MGH" menu item
                frappe.ui.toolbar.add_help_menu_item(__('About MGH'), function() {
                    frappe.msgprint({
                        title: __('About MGH'),
                        message: __('MGH Custom Application'),
                        indicator: 'blue'
                    });
                });
                
                // Add "MGH Support" menu item
                frappe.ui.toolbar.add_help_menu_item(__('MGH Support'), function() {
                    // Open support page - update URL as needed
                    window.open('/support', '_blank');
                });
            }
        } catch (e) {
            console.log('Help menu customization error:', e);
            // Fallback: Use DOM manipulation if API not available
            setTimeout(mg.customizeHelpMenuDOM, 500);
        }
    } else {
        // Retry if toolbar not ready yet
        setTimeout(mg.customizeHelpMenu, 500);
    }
};

// Fallback DOM-based help menu customization
mg.customizeHelpMenuDOM = function() {
    // Find help menu dropdown
    const helpMenu = $('.help-menu, .dropdown-help, [data-toggle="dropdown"]').filter(function() {
        return $(this).text().toLowerCase().includes('help');
    });
    
    if (helpMenu.length) {
        // Remove keyboard shortcuts and other items
        helpMenu.find('.dropdown-menu, .help-menu-item').each(function() {
            const $item = $(this);
            const text = $item.text().toLowerCase();
            
            // Remove keyboard shortcuts
            if (text.includes('keyboard') || text.includes('shortcut') || text.includes('⌘') || text.includes('cmd')) {
                $item.remove();
            }
            
            // Customize About
            if (text.includes('about') && !text.includes('mgh')) {
                $item.find('a').text('About MGH');
            }
            
            // Customize Support
            if (text.includes('support') && !text.includes('mgh')) {
                const $link = $item.find('a');
                $link.text('MGH Support');
                $link.attr('href', '/support');
                $link.attr('target', '_blank');
            }
        });
    }
};

// Custom Frappe Hooks
mg.hooks = {
    // Hook into form refresh
    onFormRefresh: function(frm) {
        // Add custom behavior when form is refreshed
        if (frm && frm.doc) {
            // Example: Add custom validation or styling
            mg.utils.enhanceFormControls();
        }
    },
    
    // Hook into list view load
    onListLoad: function(listview) {
        // Add custom behavior when list view loads
        setTimeout(function() {
            mg.utils.applyFadeIn();
        }, 100);
    },
    
    // Hook into page load
    onPageLoad: function() {
        // Apply customizations to the page
        mg.utils.enhanceFormControls();
        mg.utils.applyFadeIn();
    }
};

// Initialize when app is ready
$(document).on('app_ready', function() {
    mg.init();
    
    // Customize help menu after a short delay to ensure toolbar is ready
    setTimeout(function() {
        mg.customizeHelpMenu();
    }, 1000);
});

// Also try to customize help menu when toolbar is clicked
$(document).on('click', '.help-menu, .dropdown-help, [data-toggle="dropdown"]', function() {
    setTimeout(function() {
        mg.customizeHelpMenu();
        mg.customizeHelpMenuDOM();
    }, 100);
});

// Hook into route changes
frappe.router.on('change', function() {
    // Re-apply customizations on route change
    setTimeout(function() {
        mg.utils.enhanceFormControls();
        mg.utils.applyFadeIn();
        // Re-customize help menu
        mg.customizeHelpMenu();
    }, 100);
});

// Hook into form refresh events
if (typeof frappe.ui.form !== 'undefined') {
    frappe.ui.form.on('*', 'refresh', function(frm) {
        mg.hooks.onFormRefresh(frm);
    });
}

// Export utilities globally for use in custom scripts
window.mg = mg;