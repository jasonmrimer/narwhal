describe 'Crew page', type: :feature do
  require_relative './pages/crew_page'
  require_relative './pages/login_page'

  xit 'allows a user to add a position to a crew member' do
    login_page = LoginPage.new
    login_page.login
    crew_page = CrewPage.new
    crew_page.fill_in_position
  end
end