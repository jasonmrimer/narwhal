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
    dashboard_page.assert_filters_by_site
  end

  it 'filters mission cards by platform' do
    dashboard_page.assert_filters_by_platform
  end
end
