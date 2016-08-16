class StaticPagesController < ApplicationController
  def index
  	@user = User.find(session[:user_id])
  end

  private
		def render_notes
			render :json => User.find(session[:user_id]).notes
		end
end
