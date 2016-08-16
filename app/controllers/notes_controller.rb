class NotesController < ApplicationController
	def create
		note = Note.new(note_params)
		note["user_id"] = session[:user_id]
		note.save
		render :json => note
	end
	def index
		render_notes
	end
	def show
		note = Note.find(params[:id])
		render :json => note
	end
	def update
		note = Note.find(params[:id])
		note.update(note_params)
		note.save
		render :json => note
	end
	def destroy
		note = Note.find(params[:id])
		note.destroy
		render_notes
	end

	private
		def note_params
			params.require(:note).permit(:title, :content)
		end
		def render_notes
			render :json => User.find(session[:user_id]).notes
		end
end
