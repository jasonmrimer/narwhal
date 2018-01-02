class DashboardPage
    include Capybara::DSL
    @@number_of_missions = 3
    
    def initialize 
        visit '/dashboard'
    end

    def has_missions?
        page.has_css?('.mission-card', :count => @@number_of_missions)
    end

    def has_site?(site)
        case site
        when 'All Sites'
            has_missions?
        when site
            page.find_all('.mission-card').count < @@number_of_missions
        end
    end
    
    def filter_by(site: 'All Sites')
        page.find(:select).find(:option, text: site).select_option
    end
end