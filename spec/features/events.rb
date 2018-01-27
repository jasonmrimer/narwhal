class Event
  include Capybara::DSL
  include RSpec::Matchers
  attr_accessor :start, :end, :title

  def initialize
    set_attrs
  end

  def create
    page.within('.side-panel') do
      click_link_or_button '+ Add Event'
      find('label', text: 'Appointment').click

      fill_in 'title', with: @title
      fill_in 'startDate', with: @start.strftime('%m/%d/%Y')
      fill_in 'startTime', with: @start.strftime('%H:%M')
      fill_in 'endDate', with: @end.strftime('%m/%d/%Y')
      fill_in 'endTime', with: @end.strftime('%H:%M')
      find('input[type="submit"]').click
    end
  end

  def update
    page.within('.side-panel') do
      find('.event-title', text: @title).click
      expect(find_field('title').value).to eq @title
      expect(find_field("Appointment", visible: false)).to be_checked

      set_attrs

      fill_in 'title', with: @title
      fill_in 'startDate', with: @start.strftime('%m/%d/%Y')
      fill_in 'startTime', with: @start.strftime('%H:%M')
      fill_in 'endDate', with: @end.strftime('%m/%d/%Y')
      fill_in 'endTime', with: @end.strftime('%H:%M')
      find('input[type="submit"]').click
    end
  end

  def delete
    page.find('.event-title', text: @title).find('button.delete').click
  end

  def exists?
    page.within('.side-panel') do
      page.has_content?(@start.strftime('%d %^b %y')) &&
      page.has_content?(@title) &&
      page.has_content?(@start.strftime('%H%MZ') + ' - ' + @end.strftime('%H%MZ'))
    end
  end

  private

  def set_attrs
    @start = Time.now.utc
    @end = @start + 3600
    @title = "Test Event #{Time.now}"
  end
end
