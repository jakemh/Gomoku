class GamesController < ApplicationController
  before_action :set_game, only: [:show, :edit, :update, :destroy]

  # GET /games
  # GET /games.json
  def index
    setup_new
  end

  # GET /games/1
  # GET /games/1.json
  def show
  end

  # GET /games/new
  def setup_new
    session[:data] ||= {}
       @game = Game.new
      @rows = session[:data]["rows"].to_i || Defaults::BOARD_SIZE_DEFAULT
       @win_chain =  session[:data]["win_chain"].to_i || Defaults::CHAIN_SIZE_DEFAULT
       @depth =  session[:data]["depth"].to_i  || Defaults::DEPTH_DEFAULT
       @moves_considered =  session[:data]["moves_considered"].to_i  || Defaults::MOVES_CONSIDERED
       @aggressiveness
       puts "ROWS TO I: ", @rows
       # @rows = Defaults::BOARD_SIZE_DEFAULT
       #        @win_chain =   Defaults::CHAIN_SIZE_DEFAULT
       #        @depth =  Defaults::DEPTH_DEFAULT
       #        @moves_considered =  Defaults::MOVES_CONSIDERED
       # session["data"] ||= {}
       games = Game.all
       @game = Game.new({:game_id => (Game.all.length + 1), 
        :rows =>  @rows, 
        :board => Array.new(@rows){Array.new(@rows){" "}}.transpose.to_json,
        :win_chain => @win_chain, 
        :moves_considered =>  @moves_considered, 
        :depth => @depth  })  

       @game.save
       session[:game] = @game.game_id
       # session[:data] = {}
       session[:data][:move_num] = 0

       session[:win_chain] = @win_chain
  end

  def new
    setup_new
    respond_to do |format|
      format.json { render json: @game, status: :created }
    end

  end


  def receive_human_move
    if params["newGame"] == "true"
      setup_new_game
    end

    move = params["coord"]
    game = Game.find(session[:game])
    board = JSON.parse(game.board)
    board[move[0].to_i][move[1].to_i] = "X"
    # puts board
    if (game.update_attributes(:board => board.to_json))
      # send_ai_move
    end
      # respond_to do |format|
      #   format.json { render json: "OK"}
      # end
  end
 def send_ai_move
    # data = nil
        Thread.new do
          ActiveRecord::Base.connection_pool.with_connection do |conn|
            data = AI::calc_move(Game.find(session[:game]), session[:win_chain])

            puts "**DATA** : ", data
            Game.find(session[:game]).update_attributes(data)
            puts "MOVE LIST: ",   data[:p2_moves]
          end
        end
      end

  def send_ai_move_retry
    @move = get_move
    if @move != false

      # respond_to do |format|
      #   format.json { render json: move}
      # end
    else
      respond_to do |format|
        format.json { render json: {:update => "**still processing move**"} }
      end
    end
  end
  def get_move
     m = Game.find(session[:game]).temp_data
     if m != nil
      puts "M: ", m
      # return JSON.parse(m)
      return m
    else 
      print "M IS NULL STILL"
      return false
    end
  end
  # GET /games/1/edit
  def edit
  end

  # POST /games
  # POST /games.json
  def create
    @game = Game.new(game_params)

    respond_to do |format|
      if @game.save
        format.html { redirect_to @game, notice: 'Game was successfully created.' }
        format.json { render action: 'show', status: :created, location: @game }
      else
        format.html { render action: 'new' }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /games/1
  # PATCH/PUT /games/1.json
  def update
    respond_to do |format|
      # session[:rows] = game_params[:rows] || @rows
      # session[:win_chain] = game_params[:win_chain] || @win_chain

      session[:data] = game_params
      puts "SESSION DATA: ", session[:data]["rows"]
      if @game.update(game_params)
        puts "UPDATED**"
        format.json { render json: @game }
      else
        format.html { render action: 'edit' }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /games/1
  # DELETE /games/1.json
  def destroy
    @game.destroy
    respond_to do |format|
      format.html { redirect_to games_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def game_params
      params[:game].permit(:rows, :depth, :moves_considered, :win_chain)
    end
end
