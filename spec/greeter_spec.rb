require_relative './pages/greetings_page'

describe 'greetings', type: :feature do
  it 'shows a greeting' do
    greetings_page = GreetingsPage.new
    expect(greetings_page).to have_random_greeting
  end
end
