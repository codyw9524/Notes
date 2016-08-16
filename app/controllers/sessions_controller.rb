class SessionsController < ApplicationController
	def create
		user = User.find_by(email: params[:email])
		user = User.find_by(username: params[:email]) unless user
		if user && user.authenticate(params[:password])
			session[:user_id] = user.id
			redirect_to '/main'
		else
			flash[:errors] = "Invalid credentials."
			redirect_to :back
		end
	end
	def destroy
		reset_session
		redirect_to '/sessions/new'
	end
end
