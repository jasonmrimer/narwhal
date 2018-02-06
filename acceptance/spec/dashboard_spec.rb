require_relative './pages/login_page'
require_relative './pages/dashboard_page'

describe 'Dashboard page', type: :feature do
  let(:dashboard_page) {
      login_page = LoginPage.new
      login_page.login
      dashboard_page = DashboardPage.new
  }

  it 'shows a Dashboard' do
    dashboard_page.assert_shows_missions
  end

  it 'filters missions by site' do
    dashboard_page.assert_shows_site('All Sites')
    dashboard_page.filter_by(site: 'DGS-1')
    dashboard_page.assert_shows_site('DGS-1')
  end
end
