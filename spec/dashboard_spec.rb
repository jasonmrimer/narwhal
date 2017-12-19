require_relative './pages/login_page'
require_relative './pages/dashboard_page'

describe 'Dashboard page', type: :feature do
  let(:dashboard_page) {
      login_page = LoginPage.new
      login_page.login
      dashboard_page = DashboardPage.new
  }

  it 'shows a Dashboard' do
    expect(dashboard_page).to have_missions
  end
end
